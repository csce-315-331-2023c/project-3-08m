// Menu.js
import React, { useEffect, useState } from 'react';
import AddOnsTable from '../components/Tables/AddOnsTable';
import { TranslateText } from '../../Translate';

/**
 * AddOns is a React component that renders a title and a table of add-ons.
 * It supports internationalization for the title text and passes the translation flag to the AddOnsTable component.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.doTL - A boolean indicating whether translations should be performed for the title.
 *
 * @returns {ReactElement} A component with a title and the AddOnsTable.
 *
 * @example
 * <AddOns doTL={true} />
 */

const AddOns = ({doTL}) => {
  const [ translationText, setTranslationText ] = useState('');

  useEffect(() => {
    if (doTL) {
      TranslateText('Add-Ons', setTranslationText);
    }
  }, [doTL])

  return (
    <div>
      <h2>{translationText || 'Add-Ons'}</h2>
      <AddOnsTable doTL={doTL}/>
    </div>
  );
};

export default AddOns;