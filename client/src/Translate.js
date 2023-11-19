import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_GOOGLE_TL_API_KEY;
// console.log(API_KEY);
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const TranslateText = (text, targetLanguage) => {
    const [translation, setTranslation] = useState(text);

    useEffect( () => {
        if (targetLanguage !== 'en') {
            const abortController = new AbortController();

            async function translate() {
                var translateURL = API_URL;
                translateURL += '?key='+API_KEY;
                translateURL += '&q='+text;
                translateURL += '&source=en';
                translateURL += '&target='+targetLanguage;
                try {
                    console.log("test");
                    const response = await fetch(translateURL, {
                        signal: abortController.signal,
                        method: 'POST'
                    });
                    // console.log(response.body);
                    const res = await response.json();
                    // console.log(res);
                    // console.log('hi');
                    setTranslation(res.data.translations[0].translatedText)
                }
                catch (error) {
                    console.log(error);
                }
            }
            translate();
            return () => {
                abortController.abort();
            }
        }
    }, [text, targetLanguage]);
    console.log(translation);
    return translation;
};

export default TranslateText;