import React from 'react';

const Input = (props: TField) => {

  return (
    <input placeholder={props.placeholder} />
  );
};

type TField = {
  placeholder: string,
  value: string,
};

export default Input;
