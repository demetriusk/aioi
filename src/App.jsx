import { useState, useMemo } from "react";
import {
  Bot,
  Search,
  TrendingUp,
  RefreshCcw,
  AlertTriangle,
  Lightbulb,
  Link2,
  ArrowUpDown,
  BarChart3,
  Users,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Все", "IT и технологии", "Финансы", "Медицина", "Образование",
  "Транспорт и логистика", "Творчество и медиа", "Юриспруденция",
  "Производство", "Торговля и сервис", "Наука"
];

const PROFESSIONS = [
  // IT и технологии
  { name: "Программист", cat: "IT и технологии", risk: 25, trend: "трансформация",
    desc: "ИИ-ассистенты (Copilot, ChatGPT) автоматизируют рутинный код, но архитектура, проектирование систем и креативные решения остаются за человеком. Спрос на разработчиков растёт.",
    skills: "Архитектура систем, работа с ИИ-инструментами, критическое мышление",
    src: [{ t: "Хабр: AI в IT — как изменится рынок труда программистов", u: "https://habr.com/ru/articles/890252/" }, { t: "Хабр: Программисты больше не нужны, их «уволит» ИИ?", u: "https://habr.com/ru/companies/lanit/articles/811697/" }] },
  { name: "Системный администратор", cat: "IT и технологии", risk: 45, trend: "трансформация",
    desc: "Облачные технологии и ИИ-мониторинг автоматизируют рутинные задачи администрирования. Роль смещается в сторону DevOps и облачной инфраструктуры.",
    skills: "Облачные платформы, DevOps, автоматизация",
    src: [{ t: "PT: Рынок труда в ИБ в России 2024-2027", u: "https://ptsecurity.com/ru-ru/research/analytics/rynok-truda-v-informaczionnoj-bezopasnosti-v-rossii-v-2024-2027-gg-prognozy-problemy-i-perspektivy/" }] },
  { name: "Тестировщик ПО", cat: "IT и технологии", risk: 55, trend: "трансформация",
    desc: "Автоматическое тестирование с помощью ИИ заменяет ручное. Но тест-дизайн, UX-тестирование и сложные сценарии требуют человека.",
    skills: "Автоматизация тестирования, аналитика, ИИ-инструменты",
    src: [{ t: "Хабр: IT-рынок труда в 2024 году — ситуация и прогноз", u: "https://habr.com/ru/companies/hh/articles/895994/" }] },
  { name: "Специалист по данным (Data Scientist)", cat: "IT и технологии", risk: 15, trend: "рост",
    desc: "Одна из самых востребованных профессий. ИИ — это инструмент работы, а не конкурент. Спрос только растёт.",
    skills: "Машинное обучение, статистика, Python, визуализация данных",
    src: [{ t: "Хабр: Рынок труда и перспективы карьеры в Data Science в 2024", u: "https://habr.com/ru/companies/otus/articles/788646/" }, { t: "hh.ru: Статистика рынка труда", u: "https://stats.hh.ru/" }] },

  // Финансы
  { name: "Бухгалтер", cat: "Финансы", risk: 75, trend: "замещение",
    desc: "Автоматизация учёта, электронный документооборот и ИИ-системы (1С, SAP) уже заменяют значительную часть рутинных операций. Останутся сложные задачи: аудит, налоговое планирование.",
    skills: "Налоговое консультирование, аудит, работа с ИИ-системами",
    src: [{ t: "Infostart: ИИ в 1С — реальные примеры внедрения", u: "https://infostart.ru/1c/articles/2222302/" }, { t: "Гендальф: ИИ в бухгалтерии — технологии 2025", u: "https://gendalf.ru/pb/commercial/2038/524745/" }] },
  { name: "Финансовый аналитик", cat: "Финансы", risk: 40, trend: "трансформация",
    desc: "ИИ обрабатывает большие массивы данных быстрее, но интерпретация, стратегические решения и переговоры остаются за человеком.",
    skills: "Стратегический анализ, ИИ-аналитика, коммуникации",
    src: [{ t: "РБК Компании: Как ИИ меняет страховой рынок", u: "https://companies.rbc.ru/news/cDcKsfJexO/kak-ii-menyaet-strahovoj-ryinok-trendyi-v-strahovanii/" }] },
  { name: "Банковский операционист", cat: "Финансы", risk: 85, trend: "замещение",
    desc: "Онлайн-банкинг, чат-боты и ИИ-системы уже сократили количество операционистов в банках на 30–40% за последние 5 лет.",
    skills: "Переквалификация: финтех, клиентский сервис высокого уровня",
    src: [{ t: "Banki.ru: Российские банки закрыли почти 600 отделений в 2024", u: "https://www.banki.ru/news/lenta/?id=11005915" }, { t: "Известия: Сбер закрыл почти 800 офисов за полгода", u: "https://iz.ru/1466992/roza-almakunova/sliianie-i-zameshchenie-sber-zakryl-pochti-800-ofisov-za-polgoda" }] },
  { name: "Страховой агент", cat: "Финансы", risk: 70, trend: "замещение",
    desc: "Онлайн-страхование и ИИ-оценка рисков сокращают потребность в агентах. Сложные корпоративные продукты пока требуют человека.",
    skills: "Консультирование, корпоративное страхование",
    src: [{ t: "Ингосстрах: Цифровизация страховых услуг в 2024", u: "https://www.ingos.ru/company/blog/2024/cifrovizatsiya-strahovykh-uslug-rossiya-2024-2025" }, { t: "TAdviser: InsurTech — цифровизация в страховании", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:InsurTech_-_%D0%A6%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%B2_%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8" }] },

  // Медицина
  { name: "Врач-терапевт", cat: "Медицина", risk: 20, trend: "трансформация",
    desc: "ИИ помогает в диагностике (анализ снимков, симптомов), но общение с пациентом, принятие решений и ответственность остаются за врачом.",
    skills: "Работа с ИИ-диагностикой, эмпатия, комплексное мышление",
    src: [{ t: "Ведомости: Доктор нейросеть — что умеет ИИ в медицине", u: "https://www.vedomosti.ru/gorod/smartcity/articles/doktor-neiroset-chto-umeet-iskusstvennii-intellekt-v-meditsine" }, { t: "Mos.ru: Как нейросети помогают врачам в Москве", u: "https://www.mos.ru/news/item/139251073/" }] },
  { name: "Врач-радиолог", cat: "Медицина", risk: 50, trend: "трансформация",
    desc: "ИИ уже распознаёт патологии на снимках точнее среднего радиолога. Но финальное решение и ответственность — за врачом. Роль меняется: от чтения снимков к супервизии ИИ.",
    skills: "Контроль ИИ-систем, сложная диагностика",
    src: [{ t: "СберМедИИ: ИИ в радиологии и рентгенологии", u: "https://sbermed.ai/ii-v-radiologii" }, { t: "Известия: К расшифровке рентгена подключили нейросеть", u: "https://iz.ru/1444928/evgeniia-borodina/ponimaiushchii-vzgliad-k-rasshifrovke-rentgena-podkliuchili-neiroset" }] },
  { name: "Медсестра / медбрат", cat: "Медицина", risk: 10, trend: "рост",
    desc: "Требует физического присутствия, эмпатии, адаптивности. ИИ практически не влияет. Дефицит кадров растёт.",
    skills: "Уход за пациентами, работа с медтехникой",
    src: [{ t: "Медвестник: Из госмедицины ушли 2000 медсестёр в 2024", u: "https://medvestnik.ru/content/news/Iz-gosmediciny-v-2024-godu-ushli-dve-tysyachi-medsester-i-feldsherov.html" }, { t: "Коммерсантъ: В России растёт дефицит медперсонала", u: "https://www.kommersant.ru/doc/6691140" }] },
  { name: "Фармацевт", cat: "Медицина", risk: 60, trend: "трансформация",
    desc: "Автоматизация выдачи лекарств и онлайн-аптеки сокращают спрос. Но консультирование и рецептурные препараты требуют специалиста.",
    skills: "Фармконсультирование, работа с цифровыми системами",
    src: [{ t: "Retail.ru: В Москве заработала первая аптека-робот", u: "https://www.retail.ru/news/v-moskve-zarabotala-pervaya-apteka-robot-7-fevralya-2024-237426/" }, { t: "GxP News: Автоматизированная аптека-робот в московской больнице", u: "https://gxpnews.net/2024/02/v-moskovskoj-bolnicze-zarabotala-avtomatizirovannaya-apteka-robot/" }] },

  // Образование
  { name: "Учитель школы", cat: "Образование", risk: 15, trend: "трансформация",
    desc: "ИИ-тьюторы и адаптивные платформы дополняют, но не заменяют учителя. Воспитание, мотивация, социализация — уникальные человеческие функции.",
    skills: "Цифровая педагогика, работа с ИИ-платформами, эмоциональный интеллект",
    src: [{ t: "Минпросвещения: Цифровая образовательная среда", u: "https://edu.gov.ru/national-project/projects/cos/" }, { t: "TAdviser: Цифровизация образования в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A6%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }] },
  { name: "Репетитор", cat: "Образование", risk: 55, trend: "трансформация",
    desc: "ИИ-тьюторы (ChatGPT, Яндекс Учебник) берут на себя объяснение типовых задач. Но подготовка к ЕГЭ, мотивация и индивидуальный подход пока требуют человека.",
    skills: "Методика, мотивация, работа с ИИ-инструментами",
    src: [{ t: "Skillbox: ИИ-помощник по математике в Яндекс Учебнике", u: "https://skillbox.ru/media/education/eksperty-rasskazali-o-novom-ii-pomoschnike-po-matematike-v-yandeks-uchebnike/" }, { t: "РБК Тренды: ИИ-репетитор для подготовки к ЕГЭ", u: "https://trends.rbc.ru/trends/education/690dff2a9a79475e96bcb940" }] },
  { name: "Преподаватель вуза", cat: "Образование", risk: 25, trend: "трансформация",
    desc: "Лекции можно записать, но научное руководство, дискуссии и исследования требуют человека.",
    skills: "Исследования, научное руководство, критическое мышление",
    src: [{ t: "НИУ ВШЭ: Магистратура «ИИ и предпринимательство»", u: "https://www.hse.ru/ma/ipii/" }, { t: "РСМД: Нейросети в высшем образовании", u: "https://russiancouncil.ru/analytics-and-comments/analytics/neyroseti-generativnyy-ii-v-vysshem-obrazovanii-mezhdunarodnyy-opyt-i-rossiyskaya-praktika/" }] },

  // Транспорт и логистика
  { name: "Водитель такси", cat: "Транспорт и логистика", risk: 70, trend: "замещение",
    desc: "Беспилотные автомобили уже тестируются в Москве (Яндекс). Полное замещение — вопрос 10–15 лет, но процесс идёт.",
    skills: "Переквалификация: логистика, техобслуживание беспилотников",
    src: [{ t: "РБК: Яндекс запустил беспилотное такси в Москве", u: "https://www.rbc.ru/technology_and_media/07/06/2023/6480446b9a7947c8c046c906" }, { t: "TAdviser: Беспилотные автомобили Яндекса", u: "https://www.tadviser.ru/index.php/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F:%D0%91%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B5_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8_%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%B0" }] },
  { name: "Водитель-дальнобойщик", cat: "Транспорт и логистика", risk: 65, trend: "замещение",
    desc: "Автономные грузовики — приоритет для логистических компаний. Но сложные дорожные условия России замедляют внедрение.",
    skills: "Управление автономным транспортом, логистика",
    src: [{ t: "РБК Тренды: Россия — один из лидеров по внедрению беспилотных грузовиков", u: "https://trends.rbc.ru/trends/innovation/cmrm/67e42b5f9a79473c2378e8a9" }, { t: "TAdviser: Беспилотный автомобиль КАМАЗ", u: "https://www.tadviser.ru/index.php/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82:%D0%91%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C_%D0%9A%D0%B0%D0%BC%D0%90%D0%97" }] },
  { name: "Логист", cat: "Транспорт и логистика", risk: 50, trend: "трансформация",
    desc: "ИИ оптимизирует маршруты и склады, но управление сложными цепочками поставок и форс-мажорами — за человеком.",
    skills: "ИИ-оптимизация, управление цепочками поставок",
    src: [{ t: "FESCO: Исследование ИИ в логистике 2024", u: "https://academy.fesco.ru/research_report_2024" }, { t: "КиберЛенинка: Оптимизация логистических маршрутов с помощью ИИ", u: "https://cyberleninka.ru/article/n/optimizatsiya-logisticheskih-marshrutov-posredstvom-primeneniya-tehnologiy-iskusstvennogo-intellekta" }] },
  { name: "Курьер", cat: "Транспорт и логистика", risk: 60, trend: "замещение",
    desc: "Роботы-курьеры (Яндекс Ровер) и дроны тестируются, но массовое внедрение займёт годы. Пока спрос на курьеров растёт.",
    skills: "Переквалификация: управление роботами-доставщиками",
    src: [{ t: "CNews: Яндекс запустил доставку роботами в Москве", u: "https://www.cnews.ru/news/top/2024-05-14_yandeks_zapustil_dostavku" }, { t: "ТАСС: Яндекс вдвое увеличит число роверов в 2024", u: "https://tass.ru/ekonomika/19418919" }] },

  // Творчество и медиа
  { name: "Журналист", cat: "Творчество и медиа", risk: 45, trend: "трансформация",
    desc: "ИИ генерирует новостные заметки и дайджесты, но расследования, интервью и авторский стиль остаются за человеком.",
    skills: "Расследовательская журналистика, факт-чекинг, мультимедиа",
    src: [{ t: "Российская газета: Нейросеть ChatGPT о замене журналистов", u: "https://rg.ru/amp/2023/02/08/i-ty-bot.html" }, { t: "Sobaka-Perm: Как ChatGPT меняет журналистику", u: "https://sobaka-perm.ru/kak-chatgpt-menyaet-zhurnalistiku-i-sozdanie-kontenta/" }] },
  { name: "Графический дизайнер", cat: "Творчество и медиа", risk: 55, trend: "трансформация",
    desc: "Midjourney, DALL-E генерируют изображения, но брендинг, UX-дизайн и концептуальная работа требуют человека. Роль меняется: от исполнителя к арт-директору ИИ.",
    skills: "Промпт-инжиниринг, UX/UI, арт-дирекция",
    src: [{ t: "Яндекс Практикум: Midjourney — облегчает ли нейросеть работу дизайнера", u: "https://practicum.yandex.ru/blog/kak-ispolzovat-midjourney-dizayneru/" }, { t: "DTF: Топ-10 курсов по нейросетям для дизайнеров", u: "https://dtf.ru/luchshii-rating/3266899-top-10-kursov-po-neirosetyam-dlya-dizainerov-onlain-obuchenie-s-nulya-v-2024-godu" }] },
  { name: "Копирайтер", cat: "Творчество и медиа", risk: 65, trend: "замещение",
    desc: "ChatGPT и аналоги уже генерируют тексты приемлемого качества. Рутинный копирайтинг (SEO-тексты, описания) под угрозой. Выживут авторы с уникальным голосом.",
    skills: "Стратегия контента, сторителлинг, редактура ИИ-текстов",
    src: [{ t: "Skillbox: ChatGPT не заменит копирайтеров — мнение главредов", u: "https://skillbox.ru/media/marketing/zamenit-li-chatgpt-kopirayterov-sprosili-u-glavredov-i-rukovoditeley-agentstv/" }, { t: "Нетология: Как нейросети упрощают работу с текстом", u: "https://netology.ru/blog/10-2024-ai-for-texts" }] },
  { name: "Фотограф", cat: "Творчество и медиа", risk: 40, trend: "трансформация",
    desc: "ИИ генерирует фотореалистичные изображения, но репортажная, портретная и авторская фотография требуют человека.",
    skills: "Авторский стиль, работа с ИИ-обработкой, видео",
    src: [{ t: "DTF: Midjourney, DALL-E 3, Leonardo.ai — какую нейросеть выбрать", u: "https://dtf.ru/howto/4546314-midjourney-dall-e-3-leonardo-ai-kak-vybrat-neyroset" }] },
  { name: "Музыкант / композитор", cat: "Творчество и медиа", risk: 35, trend: "трансформация",
    desc: "ИИ создаёт фоновую музыку, но авторское творчество, живые выступления и эмоциональная глубина — за человеком.",
    skills: "Работа с ИИ-инструментами, живое исполнение, авторство",
    src: [{ t: "РБК Тренды: Музыка, создаваемая нейросетью — 8 примеров", u: "https://trends.rbc.ru/trends/industry/668e56409a79472586da205d" }, { t: "Хабр: Топ-10 нейросетей для написания песен", u: "https://habr.com/ru/companies/bothub/articles/960084/" }] },

  // Юриспруденция
  { name: "Юрист", cat: "Юриспруденция", risk: 35, trend: "трансформация",
    desc: "ИИ автоматизирует анализ документов и поиск прецедентов, но стратегия, переговоры и судебная защита — за человеком.",
    skills: "Работа с LegalTech, переговоры, стратегическое мышление",
    src: [{ t: "Известия: Как юристы используют ИИ", u: "https://iz.ru/1592744/alena-svetunkova/neironka-zakona-kak-iuristy-ispolzuiut-iskusstvennyi-intellekt" }, { t: "РБК Тренды: Как развивается Legal AI", u: "https://trends.rbc.ru/trends/innovation/687110ec9a79478fa6d8db5a" }] },
  { name: "Нотариус", cat: "Юриспруденция", risk: 50, trend: "трансформация",
    desc: "Электронный документооборот и цифровые подписи сокращают потребность в нотариальных действиях, но полное замещение невозможно из-за юридических требований.",
    skills: "Цифровые юридические сервисы",
    src: [{ t: "TAdviser: Электронный нотариат в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D1%82%D0%B0%D1%80%D0%B8%D0%B0%D1%82" }, { t: "Notariat.ru: Электронный документ через нотариуса", u: "https://notariat.ru/ru-ru/news/elektronnyj-dokument-proshe-i-dostupnee-cherez-notariusa" }] },

  // Производство
  { name: "Оператор станка с ЧПУ", cat: "Производство", risk: 60, trend: "трансформация",
    desc: "Автоматизация производства идёт давно. ИИ добавляет предиктивное обслуживание и оптимизацию. Но наладка и контроль требуют человека.",
    skills: "Программирование ЧПУ, работа с ИИ-системами",
    src: [{ t: "ВШЭ: Роботизация станков с ЧПУ", u: "https://hsbi.hse.ru/articles/robotizatsiya-stankov-s-chpu/" }, { t: "TAdviser: Станкостроение в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A1%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }] },
  { name: "Сварщик", cat: "Производство", risk: 45, trend: "трансформация",
    desc: "Роботы-сварщики используются на конвейерах, но ремонтная, строительная и нестандартная сварка требуют человека.",
    skills: "Сложная сварка, управление роботами",
    src: [{ t: "Forbes: Как в России растёт рынок промышленных роботов", u: "https://www.forbes.ru/tekhnologii/533789-deklaracia-nezavisimosti-kak-v-rossii-rastet-rynok-promyslennyh-robotov" }] },
  { name: "Кладовщик", cat: "Производство", risk: 80, trend: "замещение",
    desc: "Автоматизированные склады (Amazon, Ozon, Wildberries) массово внедряют роботов. Профессия под высоким риском.",
    skills: "Переквалификация: управление складской робототехникой",
    src: [{ t: "TAdviser: Складские роботы в Wildberries", u: "https://www.tadviser.ru/index.php/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82:%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4%D1%81%D0%BA%D0%B8%D0%B5_%D1%80%D0%BE%D0%B1%D0%BE%D1%82%D1%8B_%D0%B2_Wildberries" }, { t: "Shoppers: Автоматизация позволила Wildberries вдвое сократить наём", u: "https://shoppers.media/news/21951_avtomatizaciia-skladov-pozvolila-wildberries-vdvoe-sokratit-naem-rabocix" }] },

  // Торговля и сервис
  { name: "Кассир", cat: "Торговля и сервис", risk: 90, trend: "замещение",
    desc: "Кассы самообслуживания, бескассовые магазины (Яндекс Лавка, Магнит) — профессия стремительно исчезает.",
    skills: "Переквалификация: мерчандайзинг, клиентский сервис",
    src: [{ t: "Российская газета: В Москве открылись магазины без продавцов", u: "https://rg.ru/2024/08/29/reg-cfo/kto-hodit-nochiu-v-magazin.html" }, { t: "Ведомости: Fix Price установит 1000+ касс самообслуживания в 2024", u: "https://www.vedomosti.ru/press_releases/2024/02/20/fix-price-v-2024-godu-ustanovit-kassi-samoobsluzhivaniya-v-bolee-chem-1-tis-svoih-magazinov" }] },
  { name: "Продавец-консультант", cat: "Торговля и сервис", risk: 60, trend: "трансформация",
    desc: "Онлайн-торговля и чат-боты сокращают спрос, но премиальные и сложные товары по-прежнему требуют человеческого консультирования.",
    skills: "Экспертные продажи, работа с CRM",
    src: [{ t: "Data Insight: Интернет-торговля в России 2024", u: "https://datainsight.ru/eCommerce_2023" }, { t: "Коммерсантъ: Оборот e-commerce в РФ превысил 10 трлн рублей", u: "https://www.kommersant.ru/doc/7248916" }] },
  { name: "Официант", cat: "Торговля и сервис", risk: 30, trend: "трансформация",
    desc: "Роботы-официанты — скорее маркетинговый ход. Гостеприимство, сервис и адаптивность требуют человека.",
    skills: "Сервис, гостеприимство, работа с цифровыми системами заказов",
    src: [{ t: "TAdviser: Интернет-торговля в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BB%D1%8F_(%D1%80%D1%8B%D0%BD%D0%BE%D0%BA_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8)" }] },
  { name: "Повар", cat: "Торговля и сервис", risk: 20, trend: "трансформация",
    desc: "ИИ помогает с рецептурой и оптимизацией меню, но приготовление еды — физический и творческий процесс.",
    skills: "Кулинарное мастерство, работа с ИИ-оптимизацией меню",
    src: [{ t: "Сбер: GigaChat для HoReCa", u: "https://developers.sber.ru/help/gigachat-api/ai-in-logistics" }] },
  { name: "Администратор отеля", cat: "Торговля и сервис", risk: 55, trend: "трансформация",
    desc: "Онлайн-бронирование и чат-боты автоматизируют рутину, но гостеприимство и решение нестандартных ситуаций — за человеком.",
    skills: "Клиентский сервис, работа с системами бронирования",
    src: [{ t: "TAdviser: Цифровизация в HoReCa", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BB%D1%8F_(%D1%80%D1%8B%D0%BD%D0%BE%D0%BA_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8)" }] },

  // Наука
  { name: "Учёный-исследователь", cat: "Наука", risk: 10, trend: "рост",
    desc: "ИИ — мощный инструмент для исследований (анализ данных, моделирование), но постановка гипотез, интерпретация и научная интуиция — за человеком.",
    skills: "Работа с ИИ-инструментами, междисциплинарность",
    src: [{ t: "TAdviser: Исследования ИИ в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D1%81%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE_%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%B0_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }, { t: "НИУ ВШЭ: Институт искусственного интеллекта", u: "https://cs.hse.ru/iai/" }] },
  { name: "Переводчик", cat: "Наука", risk: 70, trend: "замещение",
    desc: "Нейросетевой перевод (DeepL, Яндекс Переводчик) достиг высокого качества. Рутинный перевод автоматизирован. Остаётся художественный и узкоспециальный перевод.",
    skills: "Художественный перевод, редактура машинного перевода, локализация",
    src: [{ t: "Хабр: Обзор движков машинного перевода — Яндекс, Google, DeepL", u: "https://habr.com/ru/articles/852810/" }, { t: "vc.ru: Битва переводчиков — DeepL, Google, Яндекс, ChatGPT", u: "https://vc.ru/id1704497/665440-bitva-perevodchikov-deepl-google-yandeks-i-chatgpt-v-borbe-za-luchshii-perevod" }] },
];

const getRiskLevel = (r) => {
  if (r <= 25) return { variant: "low", label: "Низкий" };
  if (r <= 50) return { variant: "medium", label: "Средний" };
  if (r <= 75) return { variant: "high", label: "Высокий" };
  return { variant: "critical", label: "Критический" };
};

const getRiskColors = (r) => {
  if (r <= 25) return { border: "#10b981", gradient: "from-emerald-500 to-emerald-300" };
  if (r <= 50) return { border: "#facc15", gradient: "from-yellow-500 to-yellow-300" };
  if (r <= 75) return { border: "#fb923c", gradient: "from-orange-500 to-orange-300" };
  return { border: "#ef4444", gradient: "from-red-500 to-red-300" };
};

const TrendIcon = ({ trend, className }) => {
  if (trend === "рост") return <TrendingUp className={cn("h-4 w-4", className)} />;
  if (trend === "трансформация") return <RefreshCcw className={cn("h-4 w-4", className)} />;
  return <AlertTriangle className={cn("h-4 w-4", className)} />;
};

const RiskBar = ({ value }) => {
  const colors = getRiskColors(value);
  return (
    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", colors.gradient)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const ProfessionCard = ({ profession, onClick }) => {
  const risk = getRiskLevel(profession.risk);
  const colors = getRiskColors(profession.risk);

  return (
    <Card
      className="p-5 cursor-pointer hover:bg-card-hover hover:-translate-y-0.5 hover:shadow-lg group"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
      onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.border; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <h3 className="font-semibold text-foreground text-base leading-tight">{profession.name}</h3>
        <Badge variant={risk.variant} className="shrink-0">
          {profession.risk}%
        </Badge>
      </div>
      <RiskBar value={profession.risk} />
      <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
        <span className="text-xs text-muted">{profession.cat}</span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendIcon trend={profession.trend} />
          <span>{profession.trend}</span>
        </div>
      </div>
    </Card>
  );
};

const ProfessionModal = ({ profession, open, onClose }) => {
  if (!profession) return null;

  const risk = getRiskLevel(profession.risk);
  const colors = getRiskColors(profession.risk);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ borderColor: colors.border }}>
        <DialogHeader>
          <DialogTitle>{profession.name}</DialogTitle>
          <DialogDescription>{profession.cat}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Risk meter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Риск автоматизации</span>
              <span className="text-2xl font-bold" style={{ color: colors.border }}>
                {profession.risk}%
              </span>
            </div>
            <RiskBar value={profession.risk} />
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant={risk.variant}>{risk.label} риск</Badge>
              <Badge variant="outline" className="flex items-center gap-1.5">
                <TrendIcon trend={profession.trend} className="h-3 w-3" />
                {profession.trend}
              </Badge>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <h4 className="text-xs uppercase tracking-wider text-muted mb-2 font-medium">
              Анализ влияния ИИ
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{profession.desc}</p>
          </div>

          {/* Skills */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2 font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Навыки будущего
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{profession.skills}</p>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted mb-2 font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Источники
            </h4>
            <div className="space-y-1">
              {profession.src.map((s, i) => (
                <a
                  key={i}
                  href={s.u}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-primary hover:text-primary-foreground py-1.5 border-b border-white/5 last:border-0 transition-colors"
                >
                  {s.t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Stats = ({ data }) => {
  const avg = Math.round(data.reduce((a, p) => a + p.risk, 0) / data.length);
  const hi = data.filter(p => p.risk > 65).length;
  const lo = data.filter(p => p.risk <= 25).length;

  const items = [
    { label: "Профессий в каталоге", val: data.length, icon: Users, color: "text-primary" },
    { label: "Средний риск", val: avg + "%", icon: BarChart3, color: getRiskLevel(avg).variant === "low" ? "text-risk-low-text" : getRiskLevel(avg).variant === "medium" ? "text-risk-medium-text" : "text-risk-high-text" },
    { label: "Под высоким риском", val: hi, icon: ShieldAlert, color: "text-risk-critical-text" },
    { label: "Устойчивы к ИИ", val: lo, icon: ShieldCheck, color: "text-risk-low-text" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {items.map((it, i) => (
        <Card key={i} className="p-4 text-center">
          <it.icon className={cn("h-5 w-5 mx-auto mb-2 opacity-60", it.color)} />
          <div className={cn("text-2xl font-bold", it.color)}>{it.val}</div>
          <div className="text-[10px] text-muted mt-1">{it.label}</div>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [sort, setSort] = useState("risk-desc");
  const [selectedProfession, setSelectedProfession] = useState(null);

  const filtered = useMemo(() => {
    let result = PROFESSIONS.filter(p =>
      (category === "Все" || p.cat === category) &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "risk-desc") result.sort((a, b) => b.risk - a.risk);
    else if (sort === "risk-asc") result.sort((a, b) => a.risk - b.risk);
    else result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return result;
  }, [query, category, sort]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12 md:py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-primary font-semibold tracking-wider uppercase mb-3">
            <Bot className="h-4 w-4" />
            Школьный проект · 10 класс
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ИИ и Занятость
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Замещение труда или его трансформация? Узнайте, как ИИ повлияет на вашу будущую профессию
          </p>
        </header>

        <Stats data={PROFESSIONS} />

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти профессию..."
            className="pl-11"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(c => (
            <Button
              key={c}
              variant={category === c ? "default" : "secondary"}
              size="sm"
              onClick={() => setCategory(c)}
              className="shrink-0"
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <span className="text-sm text-muted">
            {filtered.length === 0 ? "Ничего не найдено" : `Найдено: ${filtered.length}`}
          </span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-auto">
              <ArrowUpDown className="h-4 w-4 mr-2 opacity-50" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="risk-desc">Риск: высокий → низкий</SelectItem>
              <SelectItem value="risk-asc">Риск: низкий → высокий</SelectItem>
              <SelectItem value="alpha">По алфавиту</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <ProfessionCard
              key={i}
              profession={p}
              onClick={() => setSelectedProfession(p)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Профессия не найдена. Попробуйте изменить запрос.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted">
            Индивидуальный проект · 10 класс · 2024-2025
          </p>
          <p className="text-[10px] text-muted/60 mt-1">
            Данные основаны на анализе открытых источников. Оценки носят ориентировочный характер.
          </p>
        </footer>
      </div>

      <ProfessionModal
        profession={selectedProfession}
        open={!!selectedProfession}
        onClose={() => setSelectedProfession(null)}
      />
    </div>
  );
}
