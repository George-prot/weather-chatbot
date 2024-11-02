# Weather Chatbot Project

This repository contains a weather chatbot project with two main implementations:
1. **Local CLI-based bot** for fetching weather information directly from the command line.
2. **Dialogflow and Azure-integrated chatbot** for cloud-based deployment with a conversational interface.

Each implementation is separated into its own branch, and both branches serve different use cases and deployment environments.

## Overview

The **Weather Chatbot** provides weather information based on user input for a specific location, with optional time-based queries. This project is implemented in two main branches:

1. **[Main Branch](https://github.com/George-prot/weather-chatbot/tree/main)** - Contains a simple command-line (CLI) application that retrieves weather data from OpenWeatherMap API for local testing.
2. **[DialogflowBot Branch](https://github.com/George-prot/weather-chatbot/tree/DialogflowBot)** - A cloud-deployed chatbot integrated with Dialogflow and Azure, using CI/CD pipelines for automated deployment and API configuration.

---

## Branch Details

### Main Branch - Local CLI-based Bot

In the **[Main Branch](https://github.com/George-prot/weather-chatbot/tree/main)**, the project is implemented as a simple command-line tool that retrieves weather data based on user input. This branch is designed for local testing and does not require any cloud-based deployment.

- **Purpose**: For testing the bot's core functionality in a local environment without any conversational or cloud-based interface.
- **Implementation**: The bot fetches weather information from the OpenWeatherMap API based on parameters set in automated command-line testing.
- **Setup Instructions**: 
  1. Clone the repository.
  2. Navigate to the main branch.
  3. Follow the README instructions specific to the main branch to set up API keys and run the bot locally.

### DialogflowBot Branch - Cloud-based Chatbot with Azure and Dialogflow

The **[DialogflowBot Branch](https://github.com/George-prot/weather-chatbot/tree/DialogflowBot)** extends the project into a fully functional chatbot, leveraging Google Dialogflow for natural language processing and hosted on Azure for cloud deployment.

- **Purpose**: This branch is designed for users who want to interact with the bot using natural language queries. It supports fetching weather data through a conversational interface deployed on Azure.
- **Implementation**: 
  - Uses Dialogflow for natural language understanding.
  - Configured with CI/CD pipelines to automate deployment to Azure.
  - Includes logic for processing date and time parameters, handling both specific dates and multi-day forecasts, with fallback responses for unsupported date ranges.
- **Setup Instructions**: 
  1. Clone the repository.
  2. Switch to the DialogflowBot branch.
  3. Follow the README instructions specific to the DialogflowBot branch to configure Dialogflow, set up API keys, and deploy to Azure.

---

## Getting Started

To get started with this project:

1. **Choose the branch** that aligns with your requirements:
   - For a **simple CLI tool**, switch to the [main branch](https://github.com/George-prot/weather-chatbot/tree/main).
   - For a **cloud-based chatbot with conversational capabilities**, switch to the [DialogflowBot branch](https://github.com/George-prot/weather-chatbot/tree/DialogflowBot).
2. **Follow the setup instructions** specific to the branch.
3. **Run the bot** based on the deployment instructions for each branch.

