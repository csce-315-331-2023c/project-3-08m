// Menu.js
import React, { useEffect, useState } from 'react';
import AddOnsTable from '../components/Tables/AddOnsTable';
import { TranslateText } from '../../Translate';

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