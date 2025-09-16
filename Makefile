# Variables
REGISTRY = gitea.ta3leem.dev
VERSION ?= 1.0
TAG ?= $(VERSION)

# Docker commands
DOCKER_BUILD = docker build
DOCKER_PUSH = docker push


# Build the Docker image
.PHONY: build
build:
	$(DOCKER_BUILD) -t $(REGISTRY):$(TAG) .

# Test the Docker image in network mode
.PHONY: test
test:
	@echo "Starting test container..."
	docker run --rm --name $(subst /,-,$(IMAGE_NAME))  --network host $(REGISTRY):$(TAG)


# Push the Docker image to the registry
.PHONY: push
push:
	$(DOCKER_PUSH) $(REGISTRY):$(TAG)

# Clean up local Docker images
.PHONY: clean
clean:
	docker rmi -f $(REGISTRY):$(TAG)

# Default target
.PHONY: all
all: build push
