// Debug script to test translation functionality
console.log("=== Translation Debug Script ===");

// Test if translations are loaded
import enTranslations from './lib/translations/en.json' assert { type: 'json' };
import hiTranslations from './lib/translations/hi.json' assert { type: 'json' };

console.log("English translations loaded:", !!enTranslations);
console.log("Hindi translations loaded:", !!hiTranslations);

// Test specific keys
const testKeys = [
  'navigation.home',
  'about.title',
  'homepage.hero.title',
  'contact.form.name'
];

console.log("\n=== Testing Translation Keys ===");
testKeys.forEach(key => {
  const enValue = getNestedValue(enTranslations, key);
  const hiValue = getNestedValue(hiTranslations, key);
  console.log(`${key}:`);
  console.log(`  EN: ${enValue}`);
  console.log(`  HI: ${hiValue}`);
});

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : `[MISSING: ${path}]`;
  }, obj);
}

// Test localStorage
console.log("\n=== Testing localStorage ===");
console.log("Current language preference:", localStorage.getItem('preferred-language'));

export { enTranslations, hiTranslations };
