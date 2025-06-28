import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LazyLoadGameImage({ image, className = "" }) {
    return (
        <LazyLoadImage
            alt="game image"
            effect="blur"
            src={image}
            className={className}
            wrapperClassName="w-full h-full"
            wrapperProps={{
                style: { transitionDelay: "0.5s" },
            }}
        />
    );
}
