/**
 * Script to safely configure Supabase MCP in ~/.claude.json
 * This script reads the existing config, merges Supabase MCP settings, and writes back
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude.json');
const PROJECT_PATH = 'C:\\DevTools\\Projects\\Halterofit';

interface MCPServer {
  command: string;
  args: string[];
}

interface ProjectConfig {
  mcpServers?: Record<string, MCPServer>;
  [key: string]: any;
}

interface ClaudeConfig {
  projects?: Record<string, ProjectConfig>;
  [key: string]: any;
}

async function main() {
  console.log('🔧 Configuring Supabase MCP for Halterofit...\n');

  // 1. Read existing config
  console.log(`📄 Reading: ${CLAUDE_CONFIG_PATH}`);
  const configContent = fs.readFileSync(CLAUDE_CONFIG_PATH, 'utf-8');
  const config: ClaudeConfig = JSON.parse(configContent);

  // 2. Initialize projects if not exists
  if (!config.projects) {
    config.projects = {};
  }

  // 3. Initialize project config if not exists
  if (!config.projects[PROJECT_PATH]) {
    console.log(`✨ Creating new project config for: ${PROJECT_PATH}`);
    config.projects[PROJECT_PATH] = {};
  }

  // 4. Initialize mcpServers if not exists
  if (!config.projects[PROJECT_PATH].mcpServers) {
    config.projects[PROJECT_PATH].mcpServers = {};
  }

  // 5. Configure Supabase MCP
  const supabaseMCP: MCPServer = {
    command: 'npx',
    args: [
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--access-token',
      'sbp_f91a6a59f3814bf8c7c68b754ce0b51dd7fdf54b',
      '--project-ref',
      'dqsemfqaedxpqhbdtzxx',
    ],
  };

  // Check if supabase already exists
  const existingSupabase = config.projects[PROJECT_PATH].mcpServers!['supabase'];
  if (existingSupabase) {
    console.log('⚠️  Supabase MCP already configured. Updating...');
  } else {
    console.log('✅ Adding Supabase MCP configuration...');
  }

  config.projects[PROJECT_PATH].mcpServers!['supabase'] = supabaseMCP;

  // 6. Write back to file
  console.log(`\n💾 Writing updated config to: ${CLAUDE_CONFIG_PATH}`);
  const updatedContent = JSON.stringify(config, null, 2);
  fs.writeFileSync(CLAUDE_CONFIG_PATH, updatedContent, 'utf-8');

  console.log('\n✅ Configuration complete!');
  console.log('\n🔄 Next steps:');
  console.log('   1. Close Claude Code completely (Ctrl+Q)');
  console.log('   2. Restart Claude Code');
  console.log('   3. Verify MCP tools are available');
  console.log('\n📋 Expected MCP tools after restart:');
  console.log('   - mcp__supabase__query');
  console.log('   - mcp__supabase__execute');
  console.log('   - mcp__supabase__get_tables');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
