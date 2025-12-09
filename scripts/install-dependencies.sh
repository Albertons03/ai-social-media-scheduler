#!/bin/bash

# UI/UX Overhaul - Dependency Installation Script
# Run this script to install all required dependencies for the overhaul

set -e  # Exit on error

echo "=================================="
echo "UI/UX Overhaul - Dependency Installer"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "Installing production dependencies..."
echo ""

# Core dependencies
npm install @dnd-kit/core@^6.1.0 \
    @dnd-kit/sortable@^8.0.0 \
    canvas-confetti@^1.9.3 \
    framer-motion@^11.0.8 \
    recharts@^2.15.0 \
    cmdk@^1.0.0 \
    react-use-gesture@^9.1.3 \
    next-themes@^0.4.4

echo ""
echo "Installing development dependencies..."
echo ""

# Dev dependencies
npm install --save-dev @axe-core/react@^4.10.4

echo ""
echo "=================================="
echo "Installation Complete!"
echo "=================================="
echo ""
echo "Installed packages:"
echo "  - @dnd-kit/core (drag-and-drop)"
echo "  - @dnd-kit/sortable (sortable lists)"
echo "  - canvas-confetti (celebration animations)"
echo "  - framer-motion (smooth animations)"
echo "  - recharts (interactive charts)"
echo "  - cmdk (command palette)"
echo "  - react-use-gesture (mobile gestures)"
echo "  - next-themes (dark mode)"
echo "  - @axe-core/react (accessibility testing)"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development server"
echo "  2. Begin Phase 1: Theme & Layout implementation"
echo "  3. Refer to TECHNICAL_IMPLEMENTATION_GUIDE.md for code examples"
echo ""
echo "Happy coding!"
