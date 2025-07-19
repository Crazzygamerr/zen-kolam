# Zen Kolam - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js application for generating, altering, and displaying kolams (traditional South Indian geometric patterns). The project uses TypeScript and focuses on 2D canvas-based drawing capabilities.

## Key Technologies
- Next.js 15+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- SVG for 2D drawing and animations
- React hooks for state management
- gif.js for GIF export functionality
- html2canvas for SVG to canvas conversion

## Kolam-Specific Guidelines
- Kolams are geometric patterns made of dots and lines
- They are traditionally drawn with rice flour and are symmetrical
- Common kolam types include: simple dot patterns, complex interlaced designs, and temple kolams
- Focus on mathematical precision and symmetry in pattern generation
- Implement features for: dot grid creation, line drawing, pattern saving/loading, and pattern variations

## Code Style Guidelines
- Use functional components with hooks
- Implement responsive design principles
- Create reusable components for kolam elements (dots, lines, curves)
- Use TypeScript interfaces for kolam data structures
- Follow Next.js best practices for performance optimization

## Drawing Library Considerations
- Use native SVG elements for lines and points
- CSS animations for smooth kolam drawing animations
- Mathematical functions for pattern generation
- SVG to GIF conversion pipeline for exports
- Lightweight and embeddable SVG output
