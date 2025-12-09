@echo off
REM UI/UX Overhaul - Dependency Installation Script (Windows)
REM Run this script to install all required dependencies for the overhaul

echo ==================================
echo UI/UX Overhaul - Dependency Installer
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

echo Installing production dependencies...
echo.

REM Core dependencies
call npm install @dnd-kit/core@^6.1.0 @dnd-kit/sortable@^8.0.0 canvas-confetti@^1.9.3 framer-motion@^11.0.8 recharts@^2.15.0 cmdk@^1.0.0 react-use-gesture@^9.1.3 next-themes@^0.4.4

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to install production dependencies
    exit /b 1
)

echo.
echo Installing development dependencies...
echo.

REM Dev dependencies
call npm install --save-dev @axe-core/react@^4.10.4

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to install development dependencies
    exit /b 1
)

echo.
echo ==================================
echo Installation Complete!
echo ==================================
echo.
echo Installed packages:
echo   - @dnd-kit/core (drag-and-drop)
echo   - @dnd-kit/sortable (sortable lists)
echo   - canvas-confetti (celebration animations)
echo   - framer-motion (smooth animations)
echo   - recharts (interactive charts)
echo   - cmdk (command palette)
echo   - react-use-gesture (mobile gestures)
echo   - next-themes (dark mode)
echo   - @axe-core/react (accessibility testing)
echo.
echo Next steps:
echo   1. Run 'npm run dev' to start development server
echo   2. Begin Phase 1: Theme ^& Layout implementation
echo   3. Refer to TECHNICAL_IMPLEMENTATION_GUIDE.md for code examples
echo.
echo Happy coding!
echo.
pause
