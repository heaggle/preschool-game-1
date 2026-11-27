export type LogicItem = { id: string; emoji: string; label: string };
export type CategoryGroup = { category: string; items: LogicItem[] };
export type MemoryItem = { emoji: string; name: string };

/** Groups used by the "odd one out" game (3 same category + 1 different). */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    category: 'animals',
    items: [
      { id: 'cat', emoji: '🐱', label: 'cat' },
      { id: 'dog', emoji: '🐶', label: 'dog' },
      { id: 'cow', emoji: '🐮', label: 'cow' },
      { id: 'pig', emoji: '🐷', label: 'pig' },
    ],
  },
  {
    category: 'fruits',
    items: [
      { id: 'apple', emoji: '🍎', label: 'apple' },
      { id: 'banana', emoji: '🍌', label: 'banana' },
      { id: 'grape', emoji: '🍇', label: 'grapes' },
      { id: 'orange', emoji: '🍊', label: 'orange' },
    ],
  },
  {
    category: 'vehicles',
    items: [
      { id: 'car', emoji: '🚗', label: 'car' },
      { id: 'bus', emoji: '🚌', label: 'bus' },
      { id: 'train', emoji: '🚂', label: 'train' },
      { id: 'plane', emoji: '✈️', label: 'plane' },
    ],
  },
  {
    category: 'food',
    items: [
      { id: 'pizza', emoji: '🍕', label: 'pizza' },
      { id: 'burger', emoji: '🍔', label: 'burger' },
      { id: 'fries', emoji: '🍟', label: 'fries' },
      { id: 'hotdog', emoji: '🌭', label: 'hot dog' },
    ],
  },
  {
    category: 'nature',
    items: [
      { id: 'tree', emoji: '🌳', label: 'tree' },
      { id: 'flower', emoji: '🌸', label: 'flower' },
      { id: 'rainbow', emoji: '🌈', label: 'rainbow' },
      { id: 'moon', emoji: '🌙', label: 'moon' },
    ],
  },
];

/** Visual tokens used to build repeating patterns. */
export const PATTERN_TOKENS = [
  '🔴',
  '🔵',
  '🟡',
  '🟢',
  '🟣',
  '🟠',
  '⭐',
  '❤️',
  '🔺',
  '🟦',
];

/** Pairs used by the memory game. */
export const MEMORY_ITEMS: MemoryItem[] = [
  { emoji: '🐱', name: 'cat' },
  { emoji: '🐶', name: 'dog' },
  { emoji: '🐰', name: 'rabbit' },
  { emoji: '🦊', name: 'fox' },
  { emoji: '🐼', name: 'panda' },
  { emoji: '🐸', name: 'frog' },
  { emoji: '🐯', name: 'tiger' },
  { emoji: '🦁', name: 'lion' },
  { emoji: '🐷', name: 'pig' },
  { emoji: '🦄', name: 'unicorn' },
  { emoji: '🐙', name: 'octopus' },
  { emoji: '🐨', name: 'koala' },
];
