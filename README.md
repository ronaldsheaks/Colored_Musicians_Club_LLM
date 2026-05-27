# Colored Musicians Club LLM Research App

A lightweight research application for analyzing Colored Musicians Club transcripts, extracting people/institutions/concepts, and supporting dissertation-aligned archival/GIS research.

## What this app does

- Presents video-by-video transcript-derived summaries.
- Lists key people, institutions, and urban studies concepts.
- Provides a searchable research dashboard.
- Includes a reusable LLM extraction prompt.
- Supports an optional local LLM backend using environment variables, so API keys are never committed.

## Quick start: static dashboard

Open `index.html` in a browser, or deploy the repository with GitHub Pages.

## Optional: run with local LLM backend

```bash
npm install
cp .env.example .env
# Add your API key and model in .env
npm start
```

Then open:

```text
http://localhost:3000
```

## Environment variables

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=your_model_here
PORT=3000
```

Never commit `.env`.

## Research framing

This application treats the Colored Musicians Club and Local 533 as Black cultural, labor, and governance infrastructure. The extraction workflow is designed to support comparison with Pittsburgh's Local 471 / Local 60 history and broader questions of Black cultural corridors, labor governance, displacement, preservation, and institutional memory.

## Current data status

The current dataset is transcript-derived and should be treated as a working research layer. Caption-noisy names and dates should be verified against archival sources before being added to the final master dataset.
