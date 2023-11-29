import { useEffect, useState } from "react";
import "./Translate.css";
// import { Dialog } from '@headlessui/react';
import { Dialog, List, ListItem, ListItemButton, ListItemText, IconButton, DialogTitle, Box, Badge } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

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

const langAbbrevs2 = {
    'Afrikaans': 'af',
    'Shqip': 'sq',
    'አማርኛ': 'am',
    'العربية': 'ar',
    'Հայերեն': 'hy',
    'অসমীয়া': 'as',
    'aymar aru': 'ay',
    'azərbaycan dili': 'az',
    'bamanankan': 'bm',
    'euskara': 'eu',
    'Беларуская': 'be',
    'বাংলা': 'bn',
    'भोजपुरी': 'bho',
    'bosanski jezik': 'bs',
    'български език': 'bg',
    'Català': 'ca',
    'Cebuano': 'ceb',
    '中文 (简体)': 'zh-CN',
    '中文 (繁体)': 'zh-TW',
    'corsu': 'co',
    'hrvatski': 'hr',
    'česky': 'cs',
    'dansk': 'da',
    'ދިވެހި': 'dv',
    '𑠖𑠵𑠌𑠤𑠮': 'doi',
    'Nederlands': 'nl',
    'English': 'en',
    'Esperanto': 'eo',
    'eesti': 'et',
    'Eʋegbe': 'ee',
    'Filipino': 'fil',
    'suomi': 'fi',
    'français': 'fr',
    'Frysk': 'fy',
    'Galego': 'gl',
    'ქართული': 'ka',
    'Deutsch': 'de',
    'Ελληνικά': 'el',
    'Avañeẽ': 'gn',
    'ગુજરાતી': 'gu',
    'Kreyòl ayisyen': 'ht',
    'Hausa': 'ha',
    'Ōlelo Hawaiʻi': 'haw',
    'עברית': 'he',
    'हिन्दी': 'hi',
    '𞄀𞄩𞄰‎': 'hmn',
    'Magyar': 'hu',
    'Íslenska': 'is',
    'Asụsụ Igbo': 'ig',
    'Ilocano': 'ilo',
    'Bahasa Indonesia': 'id',
    'Gaeilge': 'ga',
    'Italiano': 'it',
    '日本語': 'ja',
    'basa Jawa': 'jv',
    'ಕನ್ನಡ': 'kn',
    'Қазақ тілі': 'kk',
    'ភាសាខ្មែរ': 'km',
    'Ikinyarwanda': 'rw',
    'कोंकणी': 'gom',
    '한국어': 'ko',
    'Krio': 'kri',
    'كوردی‎': 'ku',
    'سۆرانی': 'ckb',
    'кыргыз тили': 'ky',
    'ພາສາລາວ': 'lo',
    'latine, lingua latina': 'la',
    'latviešu valoda': 'lv',
    'Lingála': 'ln',
    'lietuvių kalba': 'lt',
    'Luganda': 'lg',
    'Lëtzebuergesch': 'lb',
    'македонски јазик': 'mk',
    'Maithili': 'mai',
    'Malagasy fiteny': 'mg',
    'بهاس ملايو‎': 'ms',
    'മലയാളം': 'ml',
    'Malti': 'mt',
    'te reo Māori': 'mi',
    'मराठी': 'mr',
    'Meiteilon': 'mni-Mtei',
    'Mizo': 'lus',
    'монгол': 'mn',
    'ဗမာစာ': 'my',
    'नेपाली': 'ne',
    'Norsk': 'no',
    'chiCheŵa': 'ny',
    'ଓଡ଼ିଆ': 'or',
    'Afaan Oromoo': 'om',
    'پښتو': 'ps',
    'فارسی': 'fa',
    'polski': 'pl',
    'português ': 'pt',
    'ਪੰਜਾਬੀ‎': 'pa',
    'Runa Simi': 'qu',
    'română': 'ro',
    'русский язык': 'ru',
    'gagana faa Samoa': 'sm',
    'संस्कृतम्': 'sa',
    'Scots Gaelic': 'gd',
    'Sepedi': 'nso',
    'српски језик': 'sr',
    'Sesotho': 'st',
    'chiShona': 'sn',
    'सिन्धी‎': 'sd',
    'Sinhala': 'si',
    'slovenčina': 'sk',
    'slovenščina': 'sl',
    'Soomaaliga': 'so',
    'español': 'es',
    'Basa Sunda': 'su',
    'Kiswahili': 'sw',
    'svenska': 'sv',
    'Wikang Tagalog': 'tl',
    'тоҷикӣ‎': 'tg',
    'தமிழ்': 'ta',
    'татарча‎': 'tt',
    'తెలుగు': 'te',
    'ไทย': 'th',
    'ትግርኛ': 'ti',
    'Xitsonga': 'ts',
    'Türkçe': 'tr',
    'Türkmen': 'tk',
    'Twi': 'ak',
    'українська': 'uk',
    'اردو': 'ur',
    'Uyƣurqə‎': 'ug',
    'zbek‎': 'uz',
    'Tiếng Việt': 'vi',
    'Cymraeg': 'cy',
    'isiXhosa': 'xh',
    'ייִדיש': 'yi',
    'Yorùbá': 'yo',
    'Zulu': 'zu',
}

const dropDownSymbol = 'V';

export function LanguageDialog({setDoTL}) {
    let [isOpen, setIsOpen] = useState(false);

    const ChangeLanguage = (name, language) => {
        sessionStorage.setItem("language", language);
        sessionStorage.setItem("languageName", name);
        // window.location.reload(false);
        setDoTL(true);
        setIsOpen(false);
    }

    // function languageBadgeContent() {
    //     if (sessionStorage.getItem("languageName") === null || sessionStorage.getItem("languageName") === 'English') {
    //         return '';
    //     }
    //     return sessionStorage.getItem("languageName");
    // }

    // function languageBadgeShow() {
    //     if (sessionStorage.getItem("languageName") === null || sessionStorage.getItem("languageName") === 'English') {
    //         console.log("yay");
    //         return false;
    //     }
    //     console.log('huh');
    //     return true;
    // }

    return (
            <div>
            <IconButton 
                onClick={() => setIsOpen(true)} 
                aria-label="Languages"
                sx={{ color: 'white' }} // Apply white color to the icon
                >
                {/* {
                    languageBadgeShow() ? 
                    <Badge badgeContent={languageBadgeContent()} color="secondary"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'bottom'}}
                        sx={{ "& .MuiBadge-badge": { fontSize: 9, maxWidth: 1000 } }}
                    >
                        <TranslateIcon />
                    </Badge>
                    :
                    <TranslateIcon />
                } */}
                <TranslateIcon />
                </IconButton>
                {isOpen &&
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
                    <DialogTitle>Select Language</DialogTitle>
                    <List>
                    {Object.entries(langAbbrevs2).map(([k, v]) => (
                        <ListItem
                        key={k}
                        disablePadding
                        dense
                        >
                        <ListItemButton onClick={() => ChangeLanguage(k,v)}>
                            <ListItemText primary={k} />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                </Dialog>
                }
            </div>
    );
}

const GetTranslateLanguage = () => {
    return (sessionStorage.getItem("language") !== null) ? sessionStorage.getItem("language") : 'en';
}

export const TranslateBulk = (textArray, setTranslation) => {
    var tLang = GetTranslateLanguage();
    const translate = () => {
        const sendRequest = async () => {
            var translateURL = API_URL;
            translateURL += '?key='+API_KEY;
            for (const text of textArray) {
                translateURL += '&q='+encodeURI(text);
            }
            translateURL += '&source=en';
            translateURL += '&target='+tLang;
            try {
                const response = await fetch(translateURL, {
                    method: 'POST',
                    referrer: window.location.href
                });
                // console.log(response.body);
                const res = await response.json();
                // var temp2 = ["你好", "再见"];
                var temp = [];
                for (const text of res.data.translations) {
                    temp.push(text.translatedText);
                }
                console.log(temp);
                setTranslation(temp);
                // return temp;
            }
            catch (error) {
                console.log(error);
            }
        }
        sendRequest();
    }
    if (tLang != 'en' && textArray.length > 0) {
        translate();
    }
    else {
        // translations = textArray;
        setTranslation(textArray);
    }
    // setDoTL(false);
    // console.log(translations);
    // console.log(tLang);
    // return translations;
};

export const TranslateText = (text, setTranslation) => {
    // var translation = text;
    var tLang = GetTranslateLanguage();

    // useEffect( () => {
    // // console.log(targetLanguage);
    //     if (targetLanguage !== 'en') {
    //         const abortController = new AbortController();
        
    //         async function translate(targetLanguage) {
    //             console.log(targetLanguage);
                // var translateURL = API_URL;
                // translateURL += '?key='+API_KEY;
                // translateURL += '&q='+encodeURI(text);
                // translateURL += '&source=en';
                // translateURL += '&target='+targetLanguage;
    //             try {
    //                 // console.log("test");
    //                 const response = await fetch(translateURL, {
    //                     signal: abortController.signal,
    //                     method: 'POST',
    //                     referrer: window.location.href
    //                 });
    //                 // console.log(response.body);
    //                 const res = await response.json();
    //                 console.log(res);
    //                 setTranslation(res.data.translations[0].translatedText)
    //             }
    //             catch (error) {
    //                 console.log(error);
    //             }
    //         }
    //         translate(targetLanguage);
    //         // return translation;
    //         return () => {
    //             abortController.abort();
    //         }
    //     }
    // }, []);
    // return translation;
    const translate = () => {
        const sendRequest = async () => {
            var translateURL = API_URL;
            translateURL += '?key='+API_KEY;
            translateURL += '&q='+encodeURI(text);
            translateURL += '&source=en';
            translateURL += '&target='+tLang;
            try {
                const response = await fetch(translateURL, {
                    method: 'POST',
                    referrer: window.location.href
                });
                const res = await response.json();
                var temp = [];
                for (const text of res.data.translations) {
                    temp.push(text.translatedText);
                }
                // console.log(temp);
                setTranslation(temp);
                // return temp;
            }
            catch (error) {
                console.log(error);
            }
        }
        sendRequest();
    }
    if (tLang !== 'en' && text.length > 0) {
        translate();
    }
    else {
        setTranslation(text);
    }
};