import React, { useEffect, useState } from 'react';
import EmployeesTable from '../components/Tables/EmployeesTable';
import { TranslateText } from '../../Translate';

/**
 * Employees is a React component that renders a title and a table of employees.
 * It supports internationalization for the title text and passes the translation flag to the EmployeesTable component.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.doTL - A boolean indicating whether translations should be performed for the title.
 *
 * @returns {ReactElement} A component with a title and the EmployeesTable.
 *
 * @example
 * <Employees doTL={true} />
 */

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