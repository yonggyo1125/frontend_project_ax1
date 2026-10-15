'use client';

import Image from 'next/image';
import { type IconType } from 'react-icons/lib';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { type SwiperModule, type Swiper as SwiperType } from 'swiper/types';

interface BannerOptions {
    pagination?: { clickable: boolean };
    navigation?: boolean;
    scrollbar?: { draggable: boolean };
    onSlideChange?: () => void;
    onSwiper?: (swiper: SwiperType) => void;
    loop?: boolean;
    spaceBetween?: number;
    slidesPerView?: number;
    className?: string;
}

type SlideBannerProps = BannerOptions & {
    width?: number | string;
    height?: number | string;
    banners: string[];
    navIcons?: IconType[];
};

const NaviButtons = ({ icons }: { icons?: IconType[] }) => {
    const swiper = useSwiper();

    if (!icons || icons.length !== 2) return <></>;

    const LeftIcon = icons[0];
    const RightIcon = icons[1];

    return (
        <div className="mt-4 flex justify-end gap-2 navi-buttons">
            <button
                type="button"
                onClick={() => swiper.slidePrev()}
                className="rounded-full border p-2 hover:bg-gray-100"
            >
                <LeftIcon size={20} />
            </button>
            <button
                type="button"
                onClick={() => swiper.slideNext()}
                className="rounded-full border p-2 hover:bg-gray-100"
            >
                <RightIcon size={20} />
            </button>
        </div>
    );
};

export default function SlideBanner({
    banners,
    width,
    height,
    pagination,
    navigation,
    scrollbar,
    onSlideChange,
    onSwiper,
    loop,
    spaceBetween,
    slidesPerView,
    className,
    navIcons,
}: SlideBannerProps): React.JSX.Element {
    const modules: SwiperModule[] = [A11y];
    const swiperOptions: BannerOptions = {};
    if (pagination) {
        swiperOptions.pagination = { clickable: true };
        modules.push(Pagination);
    }
    if (navigation) {
        swiperOptions.navigation = true;
        modules.push(Navigation);
    }
    if (scrollbar) {
        swiperOptions.scrollbar = { draggable: true };
        modules.push(Scrollbar);
    }

    if (typeof spaceBetween === 'number') {
        swiperOptions.spaceBetween = spaceBetween;
    }

    if (typeof slidesPerView === 'number') {
        swiperOptions.slidesPerView = slidesPerView;
    }
    if (onSwiper) swiperOptions.onSwiper = onSwiper;
    if (onSlideChange) swiperOptions.onSlideChange = onSlideChange;
    if (typeof loop === 'boolean') swiperOptions.loop = loop;
    const style: { width?: number | string; height?: number | string } = {};
    if (width) style.width = width;
    if (height) style.height = height;
    return (
        banners && (
            <Swiper
                {...swiperOptions}
                className={className ?? 'min-h-40 w-full'}
            >
                {banners.map((imgUrl, i) => (
                    <SwiperSlide key={`${imgUrl}_${i}`} style={style}>
                        <Image
                            src={imgUrl}
                            fill
                            sizes="width: 100%"
                            className="object-cover"
                            alt="슬라이드 배너"
                        />
                    </SwiperSlide>
                ))}
                <NaviButtons icons={navIcons} />
            </Swiper>
        )
    );
}
