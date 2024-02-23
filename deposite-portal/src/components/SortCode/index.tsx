import React, { useMemo } from 'react';

export type Props = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
};

export const SortCode = ({ value, valueLength, onChange }: Props) => {
  const RE_DIGIT = new RegExp(/^\d+$/);

  const valueItems = useMemo(() => {
    const valueArray = value.match(/.{1,2}/g) || [];
    const items: Array<string> = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push('');
      }
    }
    return items;
  }, [RE_DIGIT, value, valueLength]);

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const target = e.target;
    let targetValue = target.value;
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : '';
    const newValue = value.substring(0, idx * 2) + targetValue + value.substring(idx * 2 + 2);
    onChange(newValue.length > 6 ? newValue.substring(0, 6) : newValue);
    if (!isTargetValueDigit) {
      return;
    }
    const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling && targetValue.length === 2) {
      nextElementSibling.focus();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const target = e.target as HTMLInputElement;

    if (e.key !== 'Backspace' || target.value.length > 1) {
      return;
    }
    if (e.key === 'Backspace' && target.value.length === 1) {
      const newValue = value.substring(0, idx * 2) + value.substring(idx * 2 + 1);
      target.value = '';
      onChange(newValue);
      return;
    }

    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  return (
    <div className="otp-group">
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type="number"
          autoComplete="one-time-code"
          maxLength={2}
          className="otp-input"
          onChange={(e) => inputOnChange(e, idx)}
          onKeyDown={(e) => {
            inputOnKeyDown(e, idx);
            e.key === 'e' && e.preventDefault();
          }}
          value={digit}
        />
      ))}
    </div>
  );
};
