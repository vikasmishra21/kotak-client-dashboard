import {RoundOffStrategy} from '../enums/round.off.strategy';

export interface RoundOff {
  type: RoundOffStrategy;
  decimal: number;
}
