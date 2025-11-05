/**
 * Test ExerciseDB Image Endpoint
 * Check if images are available via /image endpoint
 */

/* eslint-disable no-console, no-undef */

import * as dotenv from 'dotenv';

dotenv.config();

const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;
const EXERCISEDB_API_HOST = process.env.EXERCISEDB_API_HOST;

async function testImageEndpoint() {
  console.log('🔍 Testing ExerciseDB Image Endpoint...\n');

  if (!EXERCISEDB_API_KEY || !EXERCISEDB_API_HOST) {
    console.error('❌ Missing API credentials');
    process.exit(1);
  }

  // First get an exercise ID
  console.log('📥 Fetching sample exercise...');
  const exercisesResponse = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=1', {
    headers: {
      'X-RapidAPI-Key': EXERCISEDB_API_KEY,
      'X-RapidAPI-Host': EXERCISEDB_API_HOST,
    },
  });

  const exercises = (await exercisesResponse.json()) as Array<{ id: string; name: string }>;
  const exerciseId = exercises[0]?.id;

  if (!exerciseId || !exercises[0]) {
    console.error('❌ Could not get exercise ID');
    process.exit(1);
  }

  console.log(`✅ Got exercise ID: ${exerciseId} (${exercises[0].name})\n`);

  // Test various image endpoint patterns
  const endpointsToTest = [
    `/exercises/${exerciseId}/image`,
    `/image/${exerciseId}`,
    `/exercises/${exerciseId}/gif`,
    `/gif/${exerciseId}`,
    `/exercises/${exerciseId}`,
  ];

  console.log('🧪 Testing image endpoints:\n');

  for (const endpoint of endpointsToTest) {
    const url = `https://exercisedb.p.rapidapi.com${endpoint}`;
    console.log(`Testing: ${endpoint}`);

    try {
      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': EXERCISEDB_API_KEY,
          'X-RapidAPI-Host': EXERCISEDB_API_HOST,
        },
      });

      console.log(`  Status: ${response.status} ${response.statusText}`);
      console.log(`  Content-Type: ${response.headers.get('content-type')}`);

      if (response.ok) {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('image')) {
          console.log('  ✅ IMAGE FOUND!');
          const buffer = await response.arrayBuffer();
          console.log(`  Size: ${(buffer.byteLength / 1024).toFixed(2)} KB\n`);
        } else {
          const text = await response.text();
          console.log(`  Response: ${text.substring(0, 200)}...\n`);
        }
      } else {
        const text = await response.text();
        console.log(`  Error: ${text.substring(0, 100)}\n`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log('If any endpoint returned an image, we can use it!');
  console.log('Otherwise, images are not available in V1 API.');
}

testImageEndpoint();
