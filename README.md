# JSON to QR Code Generator

A modern, elegant, and highly customizable Next.js web application that converts JSON data into QR codes. Built with React, Tailwind CSS, and shadcn/ui.

## 🌟 Overview

The application takes a JSON payload and dynamically generates a QR code. It intelligently parses the JSON to detect specific structures (like WiFi configurations, vCards, or Emails) and generates standard, universally recognized QR payloads. If the JSON doesn't match a known schema, it falls back to a stringified JSON payload.

## ✨ Core Features

- **Intelligent Payload Parsing:**
  - Automatically detects standard schemas (WiFi, vCard, Email, SMS, Geo-location, etc.).
  - Generates standard formatted QR strings based on the detected schema.
  - Graceful fallback to stringified JSON for arbitrary data.
- **Deep Customization:**
  - Adjust foreground and background colors.
  - Upload and embed a custom logo in the center of the QR code.
  - Select Error Correction Levels (L, M, Q, H) to support embedded logos or degraded scanning conditions.
- **Export Options:**
  - Download the generated QR code in high-quality **PNG** format.
  - Download scalable vector graphics in **SVG** format.
- **Modern Theming & Aesthetics:**
  - System-aware Light and Dark mode using `next-themes`.
  - Elegant UI built with `shadcn/ui` components.
  - Smooth micro-interactions and transitions using `framer-motion`.

## 🏗 Architecture & SOLID Principles

The project is structured with maintainability and scalability in mind, adhering closely to **SOLID** principles:

1.  **Single Responsibility Principle (SRP):**
    - _Separation of Concerns:_ UI components are strictly separated from business logic.
    - _Modules:_ `ParserEngine` (handles JSON parsing), `ConfigStore` (manages user preferences), and UI components (`JSONInput`, `PreviewPanel`, `Customizer`) each have exactly one reason to change.
2.  **Open/Closed Principle (OCP):**
    - _Extensible Parsing:_ The `ParserEngine` uses a Strategy Pattern. To add support for a new QR standard (e.g., Crypto Wallet Address), we create a new `Strategy` class without modifying the core parsing engine.
3.  **Liskov Substitution Principle (LSP):**
    - All parsing strategies implement a base `PayloadStrategy` interface. The core engine can substitute any strategy without knowing its internal implementation.
4.  **Interface Segregation Principle (ISP):**
    - Interfaces are kept small and focused. For instance, the interface for color configuration is separate from the interface for payload structure.
5.  **Dependency Inversion Principle (DIP):**
    - High-level modules (the React UI) depend on abstractions (custom hooks and interfaces) rather than concrete parsing or generation implementations.

## 🛠 Technology Stack

- **Framework:** Next.js (App Router) with React 19
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui & Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Theming:** next-themes (Light/Dark mode)
- **QR Generation:** `qrcode.react` (or similar for native SVG/Canvas rendering)
- **Validation:** `zod` (for strict JSON schema validation and parsing)

## 🗺 Implementation Plan

1.  **Phase 1: Foundation & Setup**
    - Initialize `shadcn/ui`, `next-themes`, and Tailwind configuration.
    - Set up standard project structure (`components/`, `lib/`, `hooks/`, `types/`).
2.  **Phase 2: The Core Engine (Business Logic)**
    - Define `PayloadStrategy` interface.
    - Implement initial strategies: `WiFiStrategy`, `VCardStrategy`, `EmailStrategy`, `FallbackStrategy`.
    - Implement the Strategy Resolver (Factory) to auto-detect JSON structure using `zod`.
3.  **Phase 3: UI Implementation**
    - Create the split-pane layout (Input & Controls on left, Live Preview on right).
    - Implement theme toggling (Light/Dark).
    - Build the `CustomizerPanel` using shadcn components (Sliders, Selects, Color Pickers).
4.  **Phase 4: QR Generation & Export**
    - Integrate the QR code renderer.
    - Implement logic to draw SVG to Canvas for PNG export.
    - Implement raw SVG download.
5.  **Phase 5: Polish & Animations**
    - Add Framer Motion for smooth state transitions (e.g., when the QR code successfully updates).
    - Add robust error handling for invalid JSON input.

---

_Designed for maintainability, elegance, and speed._

don't forget to read [AGENTS.md](AGENTS.md)
