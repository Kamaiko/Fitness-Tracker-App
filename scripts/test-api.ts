/**
 * ExerciseDB API Test Script
 * Tests API response structure to determine V1 vs V2
 */

/* eslint-disable no-console, no-undef */

import * as dotenv from 'dotenv';

dotenv.config();

const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;
const EXERCISEDB_API_HOST = process.env.EXERCISEDB_API_HOST;

async function testAPI() {
  console.log('🔍 Testing ExerciseDB API Structure...\n');

  console.log('📋 Configuration:');
  console.log(
    `   API Key: ${EXERCISEDB_API_KEY ? '***' + EXERCISEDB_API_KEY.slice(-4) : '❌ MISSING'}`
  );
  console.log(`   API Host: ${EXERCISEDB_API_HOST || '❌ MISSING'}\n`);

  if (!EXERCISEDB_API_KEY || !EXERCISEDB_API_HOST) {
    console.error('❌ Missing API credentials in .env');
    process.exit(1);
  }

  try {
    console.log('🌐 Fetching from: https://exercisedb.p.rapidapi.com/exercises\n');

    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      headers: {
        'X-RapidAPI-Key': EXERCISEDB_API_KEY,
        'X-RapidAPI-Host': EXERCISEDB_API_HOST,
      },
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      process.exit(1);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('❌ Unexpected response: Not an array');
      console.log('Response:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log(`✅ Received ${data.length} exercises\n`);

    if (data.length === 0) {
      console.warn('⚠️  No exercises returned');
      process.exit(0);
    }

    const firstExercise = data[0];
    const fieldNames = Object.keys(firstExercise);

    console.log('📊 API Response Structure Analysis:\n');
    console.log('='.repeat(60));
    console.log('Field Names:', fieldNames.join(', '));
    console.log('='.repeat(60));
    console.log('\n🔍 Field Type Analysis:\n');

    // Analyze each field
    fieldNames.forEach((field) => {
      const value = firstExercise[field];
      const type = Array.isArray(value) ? `array[${value.length}]` : typeof value;
      const sample =
        typeof value === 'string'
          ? value.substring(0, 50) + (value.length > 50 ? '...' : '')
          : Array.isArray(value)
            ? `[${value.slice(0, 2).join(', ')}${value.length > 2 ? '...' : ''}]`
            : value;

      console.log(`   ${field.padEnd(20)} ${type.padEnd(15)} ${JSON.stringify(sample)}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('📄 Full First Exercise:\n');
    console.log(JSON.stringify(firstExercise, null, 2));
    console.log('='.repeat(60));

    // Determine API version
    console.log('\n🎯 API Version Detection:\n');

    const hasExerciseId = 'exerciseId' in firstExercise;
    const hasId = 'id' in firstExercise;
    const bodyPartIsArray = Array.isArray(firstExercise.bodyPart || firstExercise.bodyParts);
    const hasPlural = 'bodyParts' in firstExercise || 'targetMuscles' in firstExercise;

    if (hasExerciseId && hasPlural) {
      console.log('   ✅ Detected: V2 API Structure');
      console.log('   - Uses exerciseId (not id)');
      console.log('   - Uses plural field names (bodyParts, targetMuscles, equipments)');
      console.log('   - Fields are arrays');
    } else if (hasId && !bodyPartIsArray) {
      console.log('   ✅ Detected: V1 API Structure');
      console.log('   - Uses id (not exerciseId)');
      console.log('   - Uses singular field names (bodyPart, target, equipment)');
      console.log('   - Fields are strings (not arrays)');
    } else {
      console.log('   ⚠️  Unknown API structure - needs investigation');
    }

    console.log('\n✅ API Test Complete\n');
  } catch (error: unknown) {
    console.error('\n❌ Test Failed:');
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      if (error.stack) {
        console.error('\n   Stack:', error.stack);
      }
    } else {
      console.error('   Unknown error:', error);
    }
    process.exit(1);
  }
}

testAPI();
