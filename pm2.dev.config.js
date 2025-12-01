/**
 * PM2 Ecosystem Configuration File for Bun-based API
 */
module.exports = {
  // Dev
  name: "suggest-me-dev",
  
  // The application file to execute
  script: "src/index.ts",
  
  // Use 'bun' as the interpreter to run the TypeScript file directly
  interpreter: "bun",
  
  // Ignore node_modules for watching performance
  ignore_watch: ["node_modules"],
  
  // Standard execution mode
  exec_mode: "fork",
  
  // Optional: Log files for development environment
  error_file: "logs/dev-err.log",
  out_file: "logs/dev-out.log",
};