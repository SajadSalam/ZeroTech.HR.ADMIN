using Domain.Shared.Enums;
using FluentValidation;
using Shared.Localization;

namespace Admin.Api.Endpoints.Questions;

public sealed record QuestionChoiceDto(string Text, bool IsCorrect);
public sealed record QuestionOrderingItemDto(string Text, int CorrectOrderIndex);
public sealed record QuestionMatchingLeftItemDto(string Text, Guid CorrectRightItemId, int Order);
public sealed record QuestionMatchingRightItemDto(Guid Id, string Text);
public sealed record QuestionTextAnswerPatternDto(string Pattern);

public interface IQuestionRequest
{
    Guid TopicId { get; }
    string TitleEn { get; }
    string TitleAr { get; }
    QuestionType QuestionType { get; }
    QuestionDifficulty Difficulty { get; }
    List<QuestionChoiceDto>? Choices { get; }
    List<QuestionOrderingItemDto>? OrderingItems { get; }
    List<QuestionMatchingLeftItemDto>? MatchingLeftItems { get; }
    List<QuestionMatchingRightItemDto>? MatchingRightItems { get; }
    List<QuestionTextAnswerPatternDto>? TextAnswerPatterns { get; }
}

public static class QuestionValidatorHelper
{
    public static void ApplyCommonQuestionValidation<T>(AbstractValidator<T> validator, ILocalizationService localizationService)
        where T : IQuestionRequest
    {
        ArgumentNullException.ThrowIfNull(validator);
        ArgumentNullException.ThrowIfNull(localizationService);

        validator.RuleFor(x => x.TopicId)
            .NotEmpty()
            .WithMessage(localizationService.GetString("Validation.Required", "TopicId"));

        validator.RuleFor(x => x.TitleEn)
            .NotEmpty()
            .WithMessage(localizationService.GetString("Validation.Required", "TitleEn"))
            .MaximumLength(500)
            .WithMessage(localizationService.GetString("Validation.MaxLength", "TitleEn", 500));

        validator.RuleFor(x => x.TitleAr)
            .NotEmpty()
            .WithMessage(localizationService.GetString("Validation.Required", "TitleAr"))
            .MaximumLength(500)
            .WithMessage(localizationService.GetString("Validation.MaxLength", "TitleAr", 500));

        validator.RuleFor(x => x.QuestionType)
            .IsInEnum()
            .WithMessage(localizationService.GetString("Validation.InvalidEnum", "QuestionType"));

        validator.RuleFor(x => x.Difficulty)
            .IsInEnum()
            .WithMessage(localizationService.GetString("Validation.InvalidEnum", "Difficulty"));

        // Validation for SingleChoice, MultipleChoice, TrueFalse
        validator.When(x => x.QuestionType == QuestionType.SingleChoice ||
                          x.QuestionType == QuestionType.MultipleChoice ||
                          x.QuestionType == QuestionType.TrueFalse, () =>
        {
            validator.RuleFor(x => x.Choices)
                .NotEmpty()
                .WithMessage(localizationService.GetString("Validation.Required", "Choices"));

            validator.RuleForEach(x => x.Choices)
                .ChildRules(choice =>
                {
                    choice.RuleFor(c => c.Text)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "Choice.Text"))
                        .MaximumLength(500)
                        .WithMessage(localizationService.GetString("Validation.MaxLength", "Choice.Text", 500));
                });
        });

        // Validation for Ordering
        validator.When(x => x.QuestionType == QuestionType.Ordering, () =>
        {
            validator.RuleFor(x => x.OrderingItems)
                .NotEmpty()
                .WithMessage(localizationService.GetString("Validation.Required", "OrderingItems"));

            validator.RuleForEach(x => x.OrderingItems)
                .ChildRules(item =>
                {
                    item.RuleFor(i => i.Text)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "OrderingItem.Text"))
                        .MaximumLength(500)
                        .WithMessage(localizationService.GetString("Validation.MaxLength", "OrderingItem.Text", 500));

                    item.RuleFor(i => i.CorrectOrderIndex)
                        .GreaterThan(0)
                        .WithMessage(localizationService.GetString("Validation.GreaterThan", "OrderingItem.CorrectOrderIndex", 0));
                });
        });

        // Validation for Matching
        validator.When(x => x.QuestionType == QuestionType.Matching, () =>
        {
            validator.RuleFor(x => x.MatchingLeftItems)
                .NotEmpty()
                .WithMessage(localizationService.GetString("Validation.Required", "MatchingLeftItems"));

            validator.RuleFor(x => x.MatchingRightItems)
                .NotEmpty()
                .WithMessage(localizationService.GetString("Validation.Required", "MatchingRightItems"));

            validator.RuleForEach(x => x.MatchingLeftItems)
                .ChildRules(item =>
                {
                    item.RuleFor(i => i.Text)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "MatchingLeftItem.Text"))
                        .MaximumLength(500)
                        .WithMessage(localizationService.GetString("Validation.MaxLength", "MatchingLeftItem.Text", 500));

                    item.RuleFor(i => i.CorrectRightItemId)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "MatchingLeftItem.CorrectRightItemId"));

                    item.RuleFor(i => i.Order)
                        .GreaterThan(0)
                        .WithMessage(localizationService.GetString("Validation.GreaterThan", "MatchingLeftItem.Order", 0));
                });

            validator.RuleForEach(x => x.MatchingRightItems)
                .ChildRules(item =>
                {
                    item.RuleFor(i => i.Id)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "MatchingRightItem.Id"));

                    item.RuleFor(i => i.Text)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "MatchingRightItem.Text"))
                        .MaximumLength(500)
                        .WithMessage(localizationService.GetString("Validation.MaxLength", "MatchingRightItem.Text", 500));
                });
        });

        // Validation for ShortAnswer and FillInBlank
        validator.When(x => x.QuestionType == QuestionType.ShortAnswer ||
                          x.QuestionType == QuestionType.FillInBlank, () =>
        {
            validator.RuleFor(x => x.TextAnswerPatterns)
                .NotEmpty()
                .WithMessage(localizationService.GetString("Validation.Required", "TextAnswerPatterns"));

            validator.RuleForEach(x => x.TextAnswerPatterns)
                .ChildRules(pattern =>
                {
                    pattern.RuleFor(p => p.Pattern)
                        .NotEmpty()
                        .WithMessage(localizationService.GetString("Validation.Required", "TextAnswerPattern.Pattern"))
                        .MaximumLength(500)
                        .WithMessage(localizationService.GetString("Validation.MaxLength", "TextAnswerPattern.Pattern", 500));
                });
        });
    }
}

