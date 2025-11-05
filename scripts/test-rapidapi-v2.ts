/**
 * RapidAPI V2 Detection Script
 *
 * Tests if ExerciseDB RapidAPI serves V2 data (with images/videos)
 * Run: npx ts-node scripts/test-rapidapi-v2.ts
 *
 * Tests multiple endpoint patterns:
 * 1. /exercises (standard endpoint)
 * 2. /v2/exercises (explicit v2 endpoint)
 * 3. /exercises?version=2 (query param)
 * 4. /exercises/v2 (path variant)
 *
 * V2 Detection Criteria:
 * - Has imageUrl field (V2)
 * - Has videoUrl field (V2)
 * - Has exerciseTips field (V2)
 * - Has variations field (V2)
 * - Has overview field (V2)
 * - Has keywords field (V2)
 * - Uses exerciseId instead of id (V2)
 */

/* eslint-disable no-console, @typescript-eslint/no-explicit-any, no-undef */

import * as dotenv from 'dotenv';

dotenv.config();

const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;
const EXERCISEDB_API_HOST = process.env.EXERCISEDB_API_HOST;

if (!EXERCISEDB_API_KEY || !EXERCISEDB_API_HOST) {
  console.error('❌ Missing ExerciseDB credentials in .env');
  process.exit(1);
}

interface EndpointTest {
  name: string;
  url: string;
  description: string;
}

const ENDPOINTS_TO_TEST: EndpointTest[] = [
  {
    name: 'Standard',
    url: 'https://exercisedb.p.rapidapi.com/exercises',
    description: 'Standard /exercises endpoint (currently returns V1)',
  },
  {
    name: 'V2 Path',
    url: 'https://exercisedb.p.rapidapi.com/v2/exercises',
    description: 'Explicit /v2/exercises path',
  },
  {
    name: 'V2 Query',
    url: 'https://exercisedb.p.rapidapi.com/exercises?version=2',
    description: 'Query parameter ?version=2',
  },
  {
    name: 'V2 Alt Path',
    url: 'https://exercisedb.p.rapidapi.com/exercises/v2',
    description: 'Alternative path /exercises/v2',
  },
  {
    name: 'Versioned API',
    url: 'https://v2.exercisedb.p.rapidapi.com/exercises',
    description: 'V2 subdomain',
  },
];

// V2-specific fields that should exist
const V2_FIELDS = [
  'imageUrl',
  'videoUrl',
  'exerciseTips',
  'variations',
  'overview',
  'keywords',
  'exerciseId', // V2 uses exerciseId, V1 uses id
  'relatedExerciseIds',
];

// V1-specific fields
const V1_FIELDS = ['id', 'description', 'difficulty', 'category'];

async function testEndpoint(endpoint: EndpointTest): Promise<void> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🧪 Testing: ${endpoint.name}`);
  console.log(`📍 URL: ${endpoint.url}`);
  console.log(`📝 Description: ${endpoint.description}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  try {
    const response = await fetch(endpoint.url, {
      headers: {
        'X-RapidAPI-Key': EXERCISEDB_API_KEY!,
        'X-RapidAPI-Host': EXERCISEDB_API_HOST!,
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`❌ Endpoint not found (404)`);
      } else if (response.status === 429) {
        console.log(`⚠️  Rate limit exceeded (429)`);
      } else {
        console.log(`❌ Error: ${response.status} ${response.statusText}`);
      }
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.log(`❌ Response is not an array`);
      console.log(`Response type: ${typeof data}`);
      console.log(`Sample:`, JSON.stringify(data).substring(0, 200));
      return;
    }

    if (data.length === 0) {
      console.log(`⚠️  Empty array returned`);
      return;
    }

    const firstExercise = data[0];
    const fields = Object.keys(firstExercise);

    console.log(`\n✅ Success! Received ${data.length} exercises`);
    console.log(`\n📋 Fields in response (${fields.length} total):`);
    console.log(`   ${fields.join(', ')}`);

    // Check for V2 fields
    const v2FieldsPresent = V2_FIELDS.filter((field) => fields.includes(field));
    const v1FieldsPresent = V1_FIELDS.filter((field) => fields.includes(field));

    console.log(`\n🔍 V2 Detection Analysis:`);
    console.log(`   V2 fields present: ${v2FieldsPresent.length}/${V2_FIELDS.length}`);
    console.log(`   ${v2FieldsPresent.join(', ') || 'NONE'}`);
    console.log(`\n   V1 fields present: ${v1FieldsPresent.length}/${V1_FIELDS.length}`);
    console.log(`   ${v1FieldsPresent.join(', ') || 'NONE'}`);

    // Determine version
    const isV2 = v2FieldsPresent.length >= 4; // At least 4 V2 fields = likely V2
    const isV1 = v1FieldsPresent.length >= 2; // At least 2 V1 fields = likely V1

    if (isV2) {
      console.log(`\n🎉 VERDICT: This appears to be V2 DATA!`);
      console.log(`\n📸 Sample Exercise (first record):`);
      console.log(JSON.stringify(firstExercise, null, 2));
    } else if (isV1) {
      console.log(`\n📊 VERDICT: This appears to be V1 DATA`);
    } else {
      console.log(`\n❓ VERDICT: Unknown version (needs manual inspection)`);
    }
  } catch (error: any) {
    console.error(`❌ Error testing endpoint: ${error.message}`);
  }
}

async function main() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🔬 ExerciseDB RapidAPI V2 Detection Test`);
  console.log(`${'='.repeat(80)}`);
  console.log(`\n📅 Date: ${new Date().toISOString()}`);
  console.log(`🔑 API Host: ${EXERCISEDB_API_HOST}`);
  console.log(`📊 Endpoints to test: ${ENDPOINTS_TO_TEST.length}`);
  console.log(`\n🎯 Goal: Determine if RapidAPI serves V2 data with images/videos\n`);

  for (const endpoint of ENDPOINTS_TO_TEST) {
    await testEndpoint(endpoint);
    // Wait 1 second between requests to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Testing Complete`);
  console.log(`${'='.repeat(80)}`);
  console.log(`\n📝 Summary:`);
  console.log(`   - If any endpoint returned "V2 DATA", use that endpoint!`);
  console.log(`   - If all returned "V1 DATA", proceed to Phase 2 (contact team)`);
  console.log(`   - If all returned 404, V2 not available via RapidAPI`);
  console.log(`\n💡 Next Steps:`);
  console.log(`   1. Review results above`);
  console.log(`   2. If V2 found: Update import script to use V2 endpoint`);
  console.log(`   3. If V2 not found: Email support@exercisedb.dev for V2 access\n`);
}

main();
