import { register, init, getLocaleFromNavigate } from 'svelte-i18n';

register('en', () => Promise.resolve({
    "app_title": "STRATEGIC MONITOR",
    "defcon": "DEFCON",
    "loading": "SYNCHRONIZING FEEDS...",
    "variant_world": "GLOBAL STRATEGIC",
    "variant_tech": "CYBER intelligence",
    "signals": "SIGNALS CONVERGENCE"
}));

register('ru', () => Promise.resolve({
    "app_title": "СТРАТЕГИЧЕСКИЙ МОНИТОР",
    "defcon": "ДЕФКОН",
    "loading": "СИНХРОНИЗАЦИЯ...",
    "variant_world": "ГЛОБАЛЬНЫЙ СТРАТЕГИЧЕСКИЙ",
    "variant_tech": "КИБЕРРАЗВЕДКА",
    "signals": "КОНВЕРГЕНЦИЯ СИГНАЛОВ"
}));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigate(),
});
