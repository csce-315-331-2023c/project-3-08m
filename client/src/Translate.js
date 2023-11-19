import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_GOOGLE_TL_API_KEY;
// console.log(API_KEY);
const API_URL = 'https://translation.googleapis.com/language/translate/v2';
const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:9000";

const langAbbrevs = {
    'Afrikaans': 'af',
    'Albanian': 'sq',
    'Amharic': 'am',
    'Arabic': 'ar',
    'Armenian': 'hy',
    'Assamese': 'as',
    'Aymara': 'ay',
    'Azerbaijani': 'az',
    'Bambara': 'bm',
    'Basque': 'eu',
    'Belarusian': 'be',
    'Bengali': 'bn',
    'Bhojpuri': 'bho',
    'Bosnian': 'bs',
    'Bulgarian': 'bg',
    'Catalan': 'ca',
    'Cebuano': 'ceb',
    'Chinese (Simplified)': 'zh-CN',
    'Chinese (Traditional)': 'zh-TW',
    'Corsican': 'co',
    'Croatian': 'hr',
    'Czech': 'cs',
    'Danish': 'da',
    'Dhivehi': 'dv',
    'Dogri': 'doi',
    'Dutch': 'nl',
    'English': 'en',
    'Esperanto': 'eo',
    'Estonian': 'et',
    'Ewe': 'ee',
    'Filipino (Tagalog)': 'fil',
    'Finnish': 'fi',
    'French': 'fr',
    'Frisian': 'fy',
    'Galician': 'gl',
    'Georgian': 'ka',
    'German': 'de',
    'Greek': 'el',
    'Guarani': 'gn',
    'Gujarati': 'gu',
    'Haitian (Creole)': 'ht',
    'Hausa': 'ha',
    'Hawaiian': 'haw',
    'Hebrew': 'he',
    'Hindi': 'hi',
    'Hmong': 'hmn',
    'Hungarian': 'hu',
    'Icelandic': 'is',
    'Igbo': 'ig',
    'Ilocano': 'ilo',
    'Indonesian': 'id',
    'Irish': 'ga',
    'Italian': 'it',
    'Japanese': 'ja',
    'Javanese': 'jv',
    'Kannada': 'kn',
    'Kazakh': 'kk',
    'Khmer': 'km',
    'Kinyarwanda': 'rw',
    'Konkani': 'gom',
    'Korean': 'ko',
    'Krio': 'kri',
    'Kurdish': 'ku',
    'Kurdish (Sorani)': 'ckb',
    'Kyrgyz': 'ky',
    'Lao': 'lo',
    'Latin': 'la',
    'Latvian': 'lv',
    'Lingala': 'ln',
    'Lithuanian': 'lt',
    'Luganda': 'lg',
    'Luxembourgish': 'lb',
    'Macedonian': 'mk',
    'Maithili': 'mai',
    'Malagasy': 'mg',
    'Malay': 'ms',
    'Malayalam': 'ml',
    'Maltese': 'mt',
    'Maori': 'mi',
    'Marathi': 'mr',
    'Meiteilon (Manipuri)': 'mni-Mtei',
    'Mizo': 'lus',
    'Mongolian': 'mn',
    'Myanmar (Burmese)': 'my',
    'Nepali': 'ne',
    'Norwegian': 'no',
    'Nyanja (Chichewa)': 'ny',
    'Odia (Oriya)': 'or',
    'Oromo': 'om',
    'Pashto': 'ps',
    'Persian': 'fa',
    'Polish': 'pl',
    'Portuguese (Portugal, Brazil)': 'pt',
    'Punjabi': 'pa',
    'Quechua': 'qu',
    'Romanian': 'ro',
    'Russian': 'ru',
    'Samoan': 'sm',
    'Sanskrit': 'sa',
    'Scots (Gaelic)': 'gd',
    'Sepedi': 'nso',
    'Serbian': 'sr',
    'Sesotho': 'st',
    'Shona': 'sn',
    'Sindhi': 'sd',
    'Sinhala (Sinhalese)': 'si',
    'Slovak': 'sk',
    'Slovenian': 'sl',
    'Somali': 'so',
    'Spanish': 'es',
    'Sundanese': 'su',
    'Swahili': 'sw',
    'Swedish': 'sv',
    'Tagalog (Filipino)': 'tl',
    'Tajik': 'tg',
    'Tamil': 'ta',
    'Tatar': 'tt',
    'Telugu': 'te',
    'Thai': 'th',
    'Tigrinya': 'ti',
    'Tsonga': 'ts',
    'Turkish': 'tr',
    'Turkmen': 'tk',
    'Twi (Akan)': 'ak',
    'Ukrainian': 'uk',
    'Urdu': 'ur',
    'Uyghur': 'ug',
    'Uzbek': 'uz',
    'Vietnamese': 'vi',
    'Welsh': 'cy',
    'Xhosa': 'xh',
    'Yiddish': 'yi',
    'Yoruba': 'yo',
    'Zulu': 'z',    
}

const dropDownSymbol = 'V';

export const LanguagesDropDown = () => {
    const [cssDisplay, setCssDisplay] = useState('none');
    
    const showDropDown = () => {
        if (cssDisplay === 'none'){
            setCssDisplay('block');
        }
        else {
            setCssDisplay('none');
        }
    };
    const ChangeLanguage = (language, e) => {
        // const abortController = new AbortController();
        async function setLanguage() {
            // console.log(JSON.stringify(language));
            try {
                await fetch(serverURL+"/setLanguage", {
                    // signal: abortController.signal,
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({language})
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        setLanguage();
        location.reload();
        // return () => {
        //     abortController.abort();
        // }
    }
    return (
        <div>
            <button onClick={showDropDown}>{dropDownSymbol}</button>
            <ul>
                {
                    Object.keys(langAbbrevs).map((key, index) => (
                        <li key={index}>
                            <button onClick={(e) => ChangeLanguage(langAbbrevs[key], e)}>
                                {key}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

const GetTranslateLanguage = () => {
    const [language, setLanguage] = useState('en');

    async function getLanguage() {
        var language = 'en';
        try {
            const res = await fetch(serverURL+"/getLanguage"/*, {signal: abortController.signal}*/);
            const json = await res.json();
            setLanguage(json.language);
            // console.log(json);
            // language = json.language;
        }
        catch (error) {
            console.log(error);
        }
        return language;
    }
    getLanguage();
    
    return language;
}

export const TranslateBulk = (textArray) => {
    // var targetLanguage = GetTranslateLanguage();
    var translations = [];
    for (const text of textArray) {
        translations.push(TranslateText(text));
    }
    return translations;
};

export const TranslateText = (text) => {
    const [translation, setTranslation] = useState(text);
    // var translation = text;
    var targetLanguage = GetTranslateLanguage();

    // useEffect( () => {
    console.log(targetLanguage);
    if (targetLanguage !== 'en') {
        // const abortController = new AbortController();

        async function translate(targetLanguage) {
            console.log(targetLanguage);
            var translateURL = API_URL;
            translateURL += '?key='+API_KEY;
            translateURL += '&q='+encodeURI(text);
            translateURL += '&source=en';
            translateURL += '&target='+targetLanguage;
            try {
                console.log("test");
                const response = await fetch(translateURL, {
                    // signal: abortController.signal,
                    method: 'POST'
                });
                // console.log(response.body);
                const res = await response.json();
                console.log(res);
                setTranslation(res.data.translations[0].translatedText)
            }
            catch (error) {
                console.log(error);
            }
        }
        translate(targetLanguage);
        return translation;
    }
    return translation;
};