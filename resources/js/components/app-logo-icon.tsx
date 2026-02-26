import { ImgHTMLAttributes } from 'react';
import favicon from '../assets/favicon.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={favicon} alt="StockPro" {...props} />;
}
