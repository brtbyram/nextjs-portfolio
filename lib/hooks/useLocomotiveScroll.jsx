import { useEffect, useRef } from 'react';

// Next.js'in client-side ortamında güvenli kurulum
const useLocomotiveScroll = (options = {}) => {
  const scrollRef = useRef(null);
  
  // Sadece bir kez, DOM hazır olduğunda çalışır
  useEffect(() => {
    let scroll;

    // Sadece tarayıcıda ve referans mevcutsa devam et
    if (typeof window === 'undefined' || !scrollRef.current) {
      return;
    }

    // Dinamik içe aktarma (import) işlemi
    // Bu, kütüphane kodunun SSR sırasında çalışmasını engeller.
    import('locomotive-scroll')
      .then((LocomotiveScrollModule) => {
        const LocomotiveScroll = LocomotiveScrollModule.default;
        
        // Locomotive Scroll'u başlat
        scroll = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          ...options, // Kullanıcının dışarıdan opsiyon geçmesine izin veririz
        });

        // Eğer bileşen render edildikten sonra kütüphane kendini ayarlarken 
        // bir DOM güncellemesi yaparsa, React'in kontrolü dışına çıkabilir.
        // Bu yüzden scroll örneğini dışarıdan erişilebilir yapmak faydalı olabilir.
        // İsteğe bağlı: scroll.update() gibi metodları çağırmak için.
      })
      .catch((error) => {
        console.error("Locomotive Scroll yüklenirken/başlatılırken hata oluştu:", error);
      });

    // Temizleme fonksiyonu: Bileşen kaldırıldığında scroll örneğini yok et
    return () => {
      if (scroll) {
        scroll.destroy();
      }
    };
  }, [options]); // Opsiyonlar değişirse tekrar başlat

  return scrollRef;
};

export default useLocomotiveScroll;