import React from 'react';
import { Placeholder, SyntaxHighlighter } from '@storybook/components';
import { ASTNode, print } from 'graphql';
import { MockedResponse } from './types';

export type SafeHighligherProps =
  | {
      kind: string;
      language: 'graphql';
      type: 'request';
      value?: ASTNode;
    }
  | {
      kind: string;
      language: 'json';
      type: 'result' | 'request';
      value?: MockedResponse['result'] | Error;
    };

export const SafeHighligher: React.FC<SafeHighligherProps> = (props) => {
  if (!props.value) {
    return <Placeholder>{`No ${props.kind} in ${props.type}`}</Placeholder>;
  }

  return (
    <SyntaxHighlighter language={props.language} copyable bordered padded>
      {props.language === 'graphql'
        ? print(props.value)
        : JSON.stringify(
            props.value,
            Object.getOwnPropertyNames(props.value),
            2
          )}
    </SyntaxHighlighter>
  );
};
