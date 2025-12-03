import { Mood, MOOD_LIST } from '../src/common/constants/foods.constants';
import { db } from '../src/infrastructure/db';
import { foods, NewFood } from '../src/infrastructure/db/schema/foods';

const FOOD_DATA: Record<Mood, string[]> = {
  happy: [
    'Fresh Strawberry Salad',
    'Mango Smoothie',
    'Chocolate Chip Cookies',
    'Gourmet Burger',
    'Avocado Toast',
    'Tiramisu',
    'Lemon Ricotta Pancakes',
    'Rainbow Sherbet',
    'Caramel Popcorn',
    'Soft Pretzel',
    'Sushi Rolls',
    'Fruit Pizza',
    'Cheesecake Slice',
    'Crispy Chicken Tacos',
    'Hazelnut Gelato',
    'Bacon & Eggs',
    'Butter Chicken',
    'Spicy Tuna Bowl',
    'Caesar Salad',
    'Red Velvet Cupcake',
    'Greek Yogurt with Honey',
    'Waffles with Berries',
    'Margherita Pizza',
    'Mint Chocolate Ice Cream',
    'Iced Matcha Latte',
  ],
  stressed: [
    'Dark Chocolate Bar (85%)',
    'Almonds & Walnuts Mix',
    'Warm Oatmeal',
    'Banana Nut Bread',
    'Lentil Soup',
    'Steamed Spinach',
    'Whole Grain Pasta',
    'Turkey Sandwich',
    'Hard-Boiled Eggs',
    'Chamomile Tea',
    'Kimchi Fried Rice',
    'Avocado Oil Salad',
    'Roasted Chickpeas',
    'Cottage Cheese',
    'Pesto Spaghetti',
    'Peanut Butter Smoothie',
    'Miso Soup',
    'Black Beans and Rice',
    'Sweet Potato Fries',
    'Kombucha Drink',
    'Chicken Noodle Soup',
    'Tofu Stir Fry',
    'Oyster Shooters',
    'Mackerel Fillets',
    'Flaxseed Crackers',
  ],
  tired: [
    'Salmon with Quinoa',
    'Spinach Omelette',
    'Brown Rice Bowl',
    'Energy Bar',
    'Coffee (Black)',
    'Green Tea',
    'Blueberry Muffins',
    'Tuna Salad',
    'Fortified Cereal',
    'Orange Juice',
    'Lean Beef Steak',
    'Edamame Pods',
    'Broccoli Cheddar Soup',
    'Black Forest Ham',
    'Cranberry Scones',
    'Veggie Wrap',
    'White Fish Tacos',
    'Ginger Shot',
    'Whole Wheat Toast',
    'Chicken Shawarma',
    'Pork Chops',
    'Canned Sardines',
    'Sweet Potato Hash',
    'Bran Muffin',
    'Grapefruit Segments',
  ],
  celebratory: [
    'Filet Mignon',
    'Lobster Thermidor',
    'Champagne',
    'Oysters on the Half Shell',
    'Chocolate Fondue',
    'Aged Cheese Platter',
    'Seafood Paella',
    'Duck Confit',
    'Foie Gras',
    'Truffle Pasta',
    'Prime Rib Roast',
    'Red Wine',
    'Espresso Martini',
    'Caviar Blinis',
    'Lamb Shank',
    'Baked Alaska',
    'Fancy Cocktails',
    'Crème Brûlée',
    'Wagyu Beef',
    'Artisan Bread Basket',
    'Scallop Ceviche',
    'Grilled Rack of Lamb',
    'Prosciutto Wrapped Melon',
    'Sparkling Cider',
    'Decadent Chocolate Cake',
  ],
};

const foodsToSeed: NewFood[] = [];
let foodId = 0;

MOOD_LIST.forEach((mood: Mood) => {
  const foodNames = FOOD_DATA[mood];
  foodNames.forEach((name) => {
    if (foodsToSeed.length < 100) {
      foodsToSeed.push({
        id: Bun.randomUUIDv7(),
        name: name.trim(),
        mood: mood,
        isAvailable: true,
      });
      foodId++;
    }
  });
});

export async function seedFoods() {
  try {
    console.log('🌱 Seeding foods...');

    await db.insert(foods).values(foodsToSeed).onConflictDoNothing({
      target: foods.name,
    });

    console.log(`✅ ${foodsToSeed.length} foods seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding foods:', error);
    throw error;
  }
}
