import React, { useEffect, useState } from 'react';
import EmployeesTable from '../components/Tables/EmployeesTable';
import { TranslateText } from '../../Translate';

const Employees = ({doTL}) => {
  const [ translationText, setTranslationText ] = useState('');

  useEffect( () => {
    if (doTL) {
      TranslateText("Employees", setTranslationText);
    }
  }, [doTL]);

  // console.log(translationText);
  return (
    <div>
      <h2>{translationText || 'Employees'}</h2>
      <EmployeesTable doTL={doTL} />
    </div>
  );
};

export default Employees;