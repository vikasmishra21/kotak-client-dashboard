export enum FilterCondition {
  AnyItemSelected = 'AnyItemSelected', // use for category type variable
  ItemSelected = 'ItemSelected', // use for category type variable
  ItemNotSelected = 'ItemNotSelected',  // use for category type variable
  AllItemsSelected = 'AllItemsSelected',  // use for category type variable
  TextEqualTo = 'TextEqualTo',
  TextNotEqualTo = 'TextNotEqualTo',
  TextContains = 'TextContains',
  TextDoesNotContain = 'TextDoesNotContain',
  TextMatchesRegex = 'TextMatchesRegex',
  WasAnswered = 'Answered',
  WasNotAnswered = 'NotAnswered',
  NumberEqualTo = 'NumberEqualTo',
  NumberNotEqualTo = 'NumberNotEqualTo',
  NumberGreaterThan = 'NumberGreaterThan',
  NumberLessThan = 'NumberLessThan',
  NumberGreaterThanEqualTo = 'NumberGreaterThanOrEqualTo',
  NumberLessThanEqualTo = 'NumberLessThanOrEqualTo'
}
