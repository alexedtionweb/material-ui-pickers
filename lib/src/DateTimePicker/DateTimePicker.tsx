import { useUtils } from '../_shared/hooks/useUtils';
import { PureDateInput } from '../_shared/PureDateInput';
import { BaseClockProps } from '../views/Clock/ClockView';
import { BaseDatePickerProps } from '../DatePicker/DatePicker';
import { DateTimePickerToolbar } from './DateTimePickerToolbar';
import { KeyboardDateInput } from '../_shared/KeyboardDateInput';
import { usePickerState } from '../_shared/hooks/usePickerState';
import { pick12hOr24hFormat } from '../_helpers/text-field-helper';
import { dateTimePickerDefaultProps } from '../constants/prop-types';
import { useKeyboardPickerState } from '../_shared/hooks/useKeyboardPickerState';
import {
  WithKeyboardInputProps,
  makePickerWithState,
  WithPureInputProps,
} from '../Picker/makePickerWithState';

export type DateTimePickerView = 'year' | 'date' | 'month' | 'hours' | 'minutes' | 'seconds';

export type BaseDateTimePickerProps = BaseClockProps & BaseDatePickerProps;

export interface DateTimePickerViewsProps extends BaseDateTimePickerProps {
  /** Array of views to show */
  views?: ('year' | 'date' | 'month' | 'hours' | 'minutes')[];
  /** First view to show in DatePicker */
  openTo?: 'year' | 'date' | 'month' | 'hours' | 'minutes';
  /** To show tabs */
  hideTabs?: boolean;
  /** Date tab icon */
  dateRangeIcon?: React.ReactNode;
  /** Time tab icon */
  timeIcon?: React.ReactNode;
}

export type DateTimePickerProps = WithPureInputProps & DateTimePickerViewsProps;

export type KeyboardDateTimePickerProps = WithKeyboardInputProps & DateTimePickerViewsProps;

const defaultProps: DateTimePickerViewsProps = {
  ...dateTimePickerDefaultProps,
  // @ts-ignore
  wider: true,
  ampmInClock: true,
  orientation: 'portrait',
  openTo: 'date',
  views: ['year', 'date', 'hours', 'minutes'],
};

function useOptions(props: DateTimePickerProps | KeyboardDateTimePickerProps) {
  const utils = useUtils();

  if (props.orientation !== 'portrait') {
    throw new Error('We are not supporting custom orientation for DateTimePicker yet :(');
  }

  return {
    getDefaultFormat: () =>
      pick12hOr24hFormat(props.format, props.ampm, {
        '12h': utils.dateTime12hFormat,
        '24h': utils.dateTime24hFormat,
      }),
  };
}

export const DateTimePicker = makePickerWithState<DateTimePickerProps>({
  useOptions,
  Input: PureDateInput,
  useState: usePickerState,
  DefaultToolbarComponent: DateTimePickerToolbar,
});

export const KeyboardDateTimePicker = makePickerWithState<KeyboardDateTimePickerProps>({
  useOptions,
  Input: KeyboardDateInput,
  useState: useKeyboardPickerState,
  DefaultToolbarComponent: DateTimePickerToolbar,
  getCustomProps: props => ({
    refuse: props.ampm ? /[^\dap]+/gi : /[^\d]+/gi,
  }),
});

DateTimePicker.defaultProps = defaultProps;
DateTimePicker.displayName = 'DateTimePicker';

KeyboardDateTimePicker.defaultProps = defaultProps;
KeyboardDateTimePicker.displayName = 'DateTimePicker';
