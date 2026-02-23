import { useState, useMemo, useEffect } from "react";
import {
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
  ChevronLeft,
  ChevronRight,
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
    src: [{ t: "Хабр: AI в IT — как изменится рынок труда программистов", u: "https://habr.com/ru/articles/890252/" }, { t: "Хабр: Программисты больше не нужны, их «уволит» ИИ?", u: "https://habr.com/ru/companies/lanit/articles/811697/" }, { t: "РБК: Рост ИИ-разработок превзошел прогнозы в 7 раз", u: "https://www.rbc.ru/spb_sz/07/12/2025/693133a09a79473e7df41089" }, { t: "Comnews: Количество ИТ-специалистов, применяющих ИИ, выросло в два раза", u: "https://www.comnews.ru/content/242450/2025-11-19/2025-w47/1010/kolichestvo-it-specialistov-primenyayuschikh-ii-za-god-vyroslo-dva-raza" }, { t: "Академия ТОП: Будущее программирования в эпоху ИИ", u: "https://msk.top-academy.ru/articles/budushee-programmistov-v-epohu-ai" }] },
  { name: "Системный администратор", cat: "IT и технологии", risk: 45, trend: "трансформация",
    desc: "Облачные технологии и ИИ-мониторинг автоматизируют рутинные задачи администрирования. Роль смещается в сторону DevOps и облачной инфраструктуры.",
    skills: "Облачные платформы, DevOps, автоматизация",
    src: [{ t: "PT: Рынок труда в ИБ в России 2024-2027", u: "https://ptsecurity.com/ru-ru/research/analytics/rynok-truda-v-informaczionnoj-bezopasnosti-v-rossii-v-2024-2027-gg-prognozy-problemy-i-perspektivy/" }, { t: "Habr: Нас не заменят! Почему сисадмины не боятся конкуренции с ИИ", u: "https://habr.com/ru/companies/ruvds/articles/930880" }, { t: "Омск Здесь: Футурология карьеры: кого выбирают работодатели в эпоху ИИ", u: "https://omskzdes.ru/society/91236.html" }, { t: "Cloud.ServerMall: VPS будущего: Заменит ли AI вашего системного администратора?", u: "https://cloud.servermall.ru/blog/budushhee-virtualizaczii-rol-ai-v-upravlenii-vps-infrastrukturoj" }, { t: "Журнал СА: Системные администраторы по-прежнему востребованы и незаменимы", u: "https://samag.ru/archive/article/4918" }] },
  { name: "Тестировщик ПО", cat: "IT и технологии", risk: 55, trend: "трансформация",
    desc: "Автоматическое тестирование с помощью ИИ заменяет ручное. Но тест-дизайн, UX-тестирование и сложные сценарии требуют человека.",
    skills: "Автоматизация тестирования, аналитика, ИИ-инструменты",
    src: [{ t: "Хабр: IT-рынок труда в 2024 году — ситуация и прогноз", u: "https://habr.com/ru/companies/hh/articles/895994/" }, { t: "IBS: Как меняется рынок тестирования ПО в России", u: "https://ibs-qa.ru/media/kak-menyaetsya-rynok-testirovaniya-po-v-rossii-maksim-kovtun-ibs-o-trendakh-osobennostyakh-sprosa-i-vliyanii-ii" }, { t: "DoersDoings: Замена тестировщиков нейросетями", u: "https://doersdoings.ru/career/zamena-testirovshhikov-nejrosetyami" }, { t: "TheCode: AI-тестирование: как ИИ помогает находить баги в коде", u: "https://thecode.media/ii-v-testirovanii" }] },
  { name: "Специалист по данным (Data Scientist)", cat: "IT и технологии", risk: 15, trend: "рост",
    desc: "Одна из самых востребованных профессий. ИИ — это инструмент работы, а не конкурент. Спрос только растёт.",
    skills: "Машинное обучение, статистика, Python, визуализация данных",
    src: [{ t: "Хабр: Рынок труда и перспективы карьеры в Data Science в 2024", u: "https://habr.com/ru/companies/otus/articles/788646/" }, { t: "DTF: Как ИИ изменяет профессию Data Scientist в 2025 году", u: "https://dtf.ru/u4i-online/4015321-kak-ii-izmenyaet-professiyu-data-scientist-v-2025-godu" }, { t: "Pedsovet: Может ли ИИ заменить работу специалиста по Data Science?", u: "https://pedsovet.su/publ/13-1-0-7468" }] },

  // Финансы
  { name: "Бухгалтер", cat: "Финансы", risk: 75, trend: "замещение",
    desc: "Автоматизация учёта, электронный документооборот и ИИ-системы (1С, SAP) уже заменяют значительную часть рутинных операций. Останутся сложные задачи: аудит, налоговое планирование.",
    skills: "Налоговое консультирование, аудит, работа с ИИ-системами",
    src: [{ t: "Infostart: ИИ в 1С — реальные примеры внедрения", u: "https://infostart.ru/1c/articles/2222302/" }, { t: "Гендальф: ИИ в бухгалтерии — технологии 2025", u: "https://gendalf.ru/pb/commercial/2038/524745/" }, { t: "Финансовый университет: Искусственный интеллект в бухгалтерии: практическое применение и экономический эффект", u: "https://www.fa.ru/university/structure/university/uso/press-service/press-releases/iskusstvennyy-intellekt-v-bukhgalterii-prakticheskoe-primenenie-i-ekonomicheskiy-effekt" }, { t: "1СБит: Искусственный интеллект в бухгалтерском учете: как автоматизация меняет работу бухгалтера", u: "https://www.1cbit.ru/blog/iskusstvennyy-intellekt-v-bukhgalterskom-uchete" }, { t: "Klerk: Заменит ли искусственный интеллект бухгалтера к 2030 году?", u: "https://www.klerk.ru/user/2416162/661410?srsltid=AfmBOooyE0H8oE7eiLdlBHlGCsemZp_CGaeM_tEwVGTsUyYZsWC0hoN0" }] },
  { name: "Финансовый аналитик", cat: "Финансы", risk: 40, trend: "трансформация",
    desc: "ИИ обрабатывает большие массивы данных быстрее, но интерпретация, стратегические решения и переговоры остаются за человеком.",
    skills: "Стратегический анализ, ИИ-аналитика, коммуникации",
    src: [{ t: "РБК Компании: Как ИИ меняет страховой рынок", u: "https://companies.rbc.ru/news/cDcKsfJexO/kak-ii-menyaet-strahovoj-ryinok-trendyi-v-strahovanii/" }, { t: "SF: Финансовая аналитика в эпоху ИИ: как ChatGPT меняет профессию", u: "https://sf.education/blog/finansovaya-analitika-v-epohu-ii" }, { t: "Финансовый университет: Применение ИИ и анализ данных в финансовой сфере РФ", u: "https://www.fa.ru/university/structure/university/uso/press-service/press-releases/primenenie-ii-i-analiz-dannykh-v-finansovoy-sfere-rf" }, { t: "РЭШ: Как искусственный интеллект меняет финансовый сектор", u: "https://news.nes.ru/news/kak-iskusstvennyij-intellekt-menyaet-finansovyij-sektor:-itogi-kruglogo-stola-resh" }] },
  { name: "Банковский операционист", cat: "Финансы", risk: 85, trend: "замещение",
    desc: "Онлайн-банкинг, чат-боты и ИИ-системы уже сократили количество операционистов в банках на 30–40% за последние 5 лет.",
    skills: "Переквалификация: финтех, клиентский сервис высокого уровня",
    src: [{ t: "Banki.ru: Российские банки закрыли почти 600 отделений в 2024", u: "https://www.banki.ru/news/lenta/?id=11005915" }, { t: "Известия: Сбер закрыл почти 800 офисов за полгода", u: "https://iz.ru/1466992/roza-almakunova/sliianie-i-zameshchenie-sber-zakryl-pochti-800-ofisov-za-polgoda" }, { t: "Lenta.ru: В России предсказали влияние ИИ на профессии в будущем", u: "https://lenta.ru/news/2025/08/02/v-rossii-predskazali-vliyanie-ii-professii-v-buduschem" }, { t: "Финансовый университет: Применение ИИ и анализ данных в финансовой сфере РФ", u: "https://www.fa.ru/university/structure/university/uso/press-service/press-releases/primenenie-ii-i-analiz-dannykh-v-finansovoy-sfere-rf" }, { t: "Tadviser: Искусственный интеллект в банках", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82_%D0%B2_%D0%B1%D0%B0%D0%BD%D0%BA%D0%B0%D1%85" }] },
  { name: "Страховой агент", cat: "Финансы", risk: 70, trend: "замещение",
    desc: "Онлайн-страхование и ИИ-оценка рисков сокращают потребность в агентах. Сложные корпоративные продукты пока требуют человека.",
    skills: "Консультирование, корпоративное страхование",
    src: [{ t: "Ингосстрах: Цифровизация страховых услуг в 2024", u: "https://www.ingos.ru/company/blog/2024/cifrovizatsiya-strahovykh-uslug-rossiya-2024-2025" }, { t: "TAdviser: InsurTech — цифровизация в страховании", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:InsurTech_-_%D0%A6%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%B2_%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8" }, { t: "SKGelios: Заменит ли искусственный интеллект страховых агентов?", u: "https://www.skgelios.ru/news/zamenit-li-iskusstvennyy-intellekt-strakhovykh-agentov" }, { t: "Финансовый университет: Страховые компании инвестируют в ИИ", u: "https://www.fa.ru/university/structure/university/uso/press-service/press-releases/strakhovye-kompanii-investiruyut-v-ii" }, { t: "ASN-News: Искусственный интеллект для страховщика — не ChatGPT", u: "https://www.asn-news.ru/news/91053" }] },

  // Медицина
  { name: "Врач-терапевт", cat: "Медицина", risk: 20, trend: "трансформация",
    desc: "ИИ помогает в диагностике (анализ снимков, симптомов), но общение с пациентом, принятие решений и ответственность остаются за врачом.",
    skills: "Работа с ИИ-диагностикой, эмпатия, комплексное мышление",
    src: [{ t: "Ведомости: Доктор нейросеть — что умеет ИИ в медицине", u: "https://www.vedomosti.ru/gorod/smartcity/articles/doktor-neiroset-chto-umeet-iskusstvennii-intellekt-v-meditsine" }, { t: "Mos.ru: Как нейросети помогают врачам в Москве", u: "https://www.mos.ru/news/item/139251073/" }, { t: "Lenta.ru: В России предсказали влияние ИИ на профессии в будущем", u: "https://lenta.ru/news/2025/08/02/v-rossii-predskazali-vliyanie-ii-professii-v-buduschem" }, { t: "NSN: Почему профессия врача не исчезнет с развитием ИИ", u: "https://nsn.fm/nauka-i-tehnologii/vrachi-ischeznut-vrach-myasnikov-rasskazal-kak-ii-menyaet-meditsinu" }, { t: "АНО ДПО ЦПКПП: Почему искусственный интеллект не сможет заменить врача", u: "https://cpkpp.ru/vse/pochemu-iskusstvennyj-intellekt-ne-smozhet-zamenit-vracha" }] },
  { name: "Врач-радиолог", cat: "Медицина", risk: 50, trend: "трансформация",
    desc: "ИИ уже распознаёт патологии на снимках точнее среднего радиолога. Но финальное решение и ответственность — за врачом. Роль меняется: от чтения снимков к супервизии ИИ.",
    skills: "Контроль ИИ-систем, сложная диагностика",
    src: [{ t: "СберМедИИ: ИИ в радиологии и рентгенологии", u: "https://sbermed.ai/ii-v-radiologii" }, { t: "Известия: К расшифровке рентгена подключили нейросеть", u: "https://iz.ru/1444928/evgeniia-borodina/ponimaiushchii-vzgliad-k-rasshifrovke-rentgena-podkliuchili-neiroset" }, { t: "Призрак без доспехов: сможет ли ИИ заменить радиологов", u: "https://strana-rosatom.ru/2021/08/23/prizrak-bez-dospehov-smozhet-li-ii-zame" }, { t: "RBC: Заменит ли ИИ врачей", u: "https://companies.rbc.ru/news/a7iPLX1bDa/zamenit-li-ii-vrachej" }] },
  { name: "Медсестра / медбрат", cat: "Медицина", risk: 10, trend: "рост",
    desc: "Требует физического присутствия, эмпатии, адаптивности. ИИ практически не влияет. Дефицит кадров растёт.",
    skills: "Уход за пациентами, работа с медтехникой",
    src: [{ t: "Медвестник: Из госмедицины ушли 2000 медсестёр в 2024", u: "https://medvestnik.ru/content/news/Iz-gosmediciny-v-2024-godu-ushli-dve-tysyachi-medsester-i-feldsherov.html" }, { t: "Коммерсантъ: В России растёт дефицит медперсонала", u: "https://www.kommersant.ru/doc/6691140" }, { t: "TERN: Как алгоритмы ИИ меняют роль медсестры в уходе за больными", u: "https://ru.tern-group.com/blog/the-rise-of-ai-chatbots-how-nurses-are-using-ai-for-real-time-clinical-decisions-in-2025" }, { t: "Softline: Искусственный интеллект для медицины: реалии 2025 года", u: "https://softline.ru/about/blog/iskusstvennyy-intellekt-dlya-meditsiny-realii-2025-goda" }, { t: "Center2M: Искусственный интеллект в медицине: технологии, методы и польза", u: "https://center2m.ru/ai-medicine" }] },
  { name: "Фармацевт", cat: "Медицина", risk: 60, trend: "трансформация",
    desc: "Автоматизация выдачи лекарств и онлайн-аптеки сокращают спрос. Но консультирование и рецептурные препараты требуют специалиста.",
    skills: "Фармконсультирование, работа с цифровыми системами",
    src: [{ t: "Retail.ru: В Москве заработала первая аптека-робот", u: "https://www.retail.ru/news/v-moskve-zarabotala-pervaya-apteka-robot-7-fevralya-2024-237426/" }, { t: "Известия: Эксперты рассказали о влиянии ИИ на фармацевтическую отрасль", u: "https://iz.ru/1837445/2025-02-12/ekspert-rasskazal-ob-effekte-ot-primenenia-ii-v-processe-razrabotki-lekarstv" }, { t: "PrimFarma: Как фармацевтические гиганты используют искусственный интеллект", u: "https://primfarma.ru/news/1/article/2939" }, { t: "PharmMedProm: Искусственный интеллект в медицине и фармацевтике - российские инновации", u: "https://pharmmedprom.ru/articles/um-horosho-a-dva-luchshe-chto-umeet-segodnya-iskusstvennii-intellekt-v-meditsine-i-farmatsevtike" }] },

  // Образование
  { name: "Учитель школы", cat: "Образование", risk: 15, trend: "трансформация",
    desc: "ИИ-тьюторы и адаптивные платформы дополняют, но не заменяют учителя. Воспитание, мотивация, социализация — уникальные человеческие функции.",
    skills: "Цифровая педагогика, работа с ИИ-платформами, эмоциональный интеллект",
    src: [{ t: "TAdviser: Цифровизация образования в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A6%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }, { t: "TagilCity: Нейросети в российских школах: как ИИ меняет образование в 2025 году", u: "https://tagilcity.ru/news/2026-01-30/ne-vrag-a-pomoschnik-smogut-li-shkolnye-uchitelya-priruchit-ii-5543402" }, { t: "RBC: Искусственный интеллект в образовании: что он меняет в школах", u: "https://www.rbc.ru/life/news/695262259a79476b239897fd" }] },
  { name: "Репетитор", cat: "Образование", risk: 55, trend: "трансформация",
    desc: "ИИ-тьюторы (ChatGPT, Яндекс Учебник) берут на себя объяснение типовых задач. Но подготовка к ЕГЭ, мотивация и индивидуальный подход пока требуют человека.",
    skills: "Методика, мотивация, работа с ИИ-инструментами",
    src: [{ t: "Skillbox: ИИ-помощник по математике в Яндекс Учебнике", u: "https://skillbox.ru/media/education/eksperty-rasskazali-o-novom-ii-pomoschnike-po-matematike-v-yandeks-uchebnike/" }, { t: "РБК Тренды: ИИ-репетитор для подготовки к ЕГЭ", u: "https://trends.rbc.ru/trends/education/690dff2a9a79475e96bcb940" }, { t: "Skillbox: Как российские учителя и преподаватели вузов используют ИИ", u: "https://skillbox.ru/media/education/kak-rossiyskie-uchitelya-i-prepodavateli-vuzov-ispolzuyut-ii" }, { t: "RBC: Заменит ли искусственный интеллект учителей", u: "https://www.rbc.ru/life/news/695262259a79476b239897fd" }, { t: "TASS: Почти 60% опрошенных россиян убеждены, что ИИ не сможет заменить учителей", u: "https://tass.ru/obschestvo/25243575" }] },
  { name: "Преподаватель вуза", cat: "Образование", risk: 25, trend: "трансформация",
    desc: "Лекции можно записать, но научное руководство, дискуссии и исследования требуют человека.",
    skills: "Исследования, научное руководство, критическое мышление",
    src: [{ t: "НИУ ВШЭ: Магистратура «ИИ и предпринимательство»", u: "https://www.hse.ru/ma/ipii/" }, { t: "РСМД: Нейросети в высшем образовании", u: "https://russiancouncil.ru/analytics-and-comments/analytics/neyroseti-generativnyy-ii-v-vysshem-obrazovanii-mezhdunarodnyy-opyt-i-rossiyskaya-praktika/" }, { t: "Skillbox: Как российские учителя и преподаватели вузов используют ИИ", u: "https://skillbox.ru/media/education/kak-rossiyskie-uchitelya-i-prepodavateli-vuzov-ispolzuyut-ii" }, { t: "Ведомости: Использование искусственного интеллекта в работе преподавателя университета", u: "https://www.vedomosti.ru/press_releases/2026/02/10/ispolzovanie-iskusstvennogo-intellekta-v-rabote-prepodavatelya-universiteta" }, { t: "TASS: Новый вызов: как ИИ-технологии трансформируют высшее образование", u: "https://tass.ru/obschestvo/25863655" }] },

  // Транспорт и логистика
  { name: "Водитель такси", cat: "Транспорт и логистика", risk: 70, trend: "замещение",
    desc: "Беспилотные автомобили уже тестируются в Москве (Яндекс). Полное замещение — вопрос 10–15 лет, но процесс идёт.",
    skills: "Переквалификация: логистика, техобслуживание беспилотников",
    src: [{ t: "РБК: Яндекс запустил беспилотное такси в Москве", u: "https://www.rbc.ru/technology_and_media/07/06/2023/6480446b9a7947c8c046c906" }, { t: "TAdviser: Беспилотные автомобили Яндекса", u: "https://www.tadviser.ru/index.php/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F:%D0%91%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B5_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8_%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%B0" }, { t: "RBC: Быстрее, безопаснее, выгоднее. Как ИИ влияет на транспорт во всем мире", u: "https://companies.rbc.ru/news/6W7vJfmeIW/byistree-bezopasnee-vyigodnee-kak-ii-vliyaet-na-transport-vo-vsem-mire" }, { t: "MoneyTimes: Эта профессия исчезает на глазах: что вытесняет таксистов с улиц российских городов", u: "https://www.moneytimes.ru/news/iskustvennyj-intellekt-v-taksi/68686" }, { t: "DevBy: «И в 2035 ещё порулю». Почему таксист, дальнобойщик и логист не боятся AI", u: "https://devby.io/news/ai-taxuet-dla-dushi" }] },
  { name: "Водитель-дальнобойщик", cat: "Транспорт и логистика", risk: 65, trend: "замещение",
    desc: "Автономные грузовики — приоритет для логистических компаний. Но сложные дорожные условия России замедляют внедрение.",
    skills: "Управление автономным транспортом, логистика",
    src: [{ t: "РБК Тренды: Россия — один из лидеров по внедрению беспилотных грузовиков", u: "https://trends.rbc.ru/trends/innovation/cmrm/67e42b5f9a79473c2378e8a9" }, { t: "TAdviser: Беспилотный автомобиль КАМАЗ", u: "https://www.tadviser.ru/index.php/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82:%D0%91%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C_%D0%9A%D0%B0%D0%BC%D0%90%D0%97" }, { t: "Habr: AI-водитель вместо дальнобойщика", u: "https://habr.com/ru/articles/979036" }, { t: "DevBy: «И в 2035 ещё порулю». Почему таксист, дальнобойщик и логист не боятся AI", u: "https://devby.io/news/ai-taxuet-dla-dushi" }, { t: "Lenta.ru: В России предсказали влияние ИИ на профессии в будущем", u: "https://lenta.ru/news/2025/08/02/v-rossii-predskazali-vliyanie-ii-professii-v-buduschem" }] },
  { name: "Логист", cat: "Транспорт и логистика", risk: 50, trend: "трансформация",
    desc: "ИИ оптимизирует маршруты и склады, но управление сложными цепочками поставок и форс-мажорами — за человеком.",
    skills: "ИИ-оптимизация, управление цепочками поставок",
    src: [{ t: "FESCO: Исследование ИИ в логистике 2024", u: "https://academy.fesco.ru/research_report_2024" }, { t: "КиберЛенинка: Оптимизация логистических маршрутов с помощью ИИ", u: "https://cyberleninka.ru/article/n/optimizatsiya-logisticheskih-marshrutov-posredstvom-primeneniya-tehnologiy-iskusstvennogo-intellekta" }, { t: "НИУ ВШЭ: ИИ не заменит экспертов по логистике", u: "https://www.hse.ru/news/expertise/1037567757.html" }, { t: "Logistics: Почему логисты будущего должны уметь работать с ИИ-ассистентами", u: "https://logistics.ru/avtomatizaciya-logistiki-obuchenie-i-razvitie-upravlenie-logistikoy-i-kompaniey/pochemu-logisty" }, { t: "InTek: Искусственный интеллект в складской логистике: глобальные тренды и российская реальность", u: "https://intekey.ru/articles/iskusstvennyy-intellekt-v-skladskoy-logistike-globalnye-trendy-i-rossiyskaya-realnost" }] },
  { name: "Курьер", cat: "Транспорт и логистика", risk: 60, trend: "замещение",
    desc: "Роботы-курьеры (Яндекс Ровер) и дроны тестируются, но массовое внедрение займёт годы. Пока спрос на курьеров растёт.",
    skills: "Переквалификация: управление роботами-доставщиками",
    src: [{ t: "CNews: Яндекс запустил доставку роботами в Москве", u: "https://www.cnews.ru/news/top/2024-05-14_yandeks_zapustil_dostavku" }, { t: "ТАСС: Яндекс вдвое увеличит число роверов в 2024", u: "https://tass.ru/ekonomika/19418919" }, { t: "4PDA: Роботы-курьеры оказались выгоднее человека — но ещё не готовы его заменить", u: "https://4pda.to/2026/01/16/451829/roboty_kurery_okazalis_vygodnee_cheloveka-no_eschyo_ne_gotovy_ego_zamenit" }, { t: "S-Group: Курьеры vs технологии: как изменится рынок доставки", u: "https://s-pro.group/tpost/90spsn72i1-kureri-vs-tehnologii-kak-izmenitsya-rino" }, { t: "Trends.RBC: Роботы-курьеры и забота об экологии: тренды городской доставки", u: "https://trends.rbc.ru/trends/industry/65cf281b9a794761d8135da0" }] },

  // Творчество и медиа
  { name: "Журналист", cat: "Творчество и медиа", risk: 45, trend: "трансформация",
    desc: "ИИ генерирует новостные заметки и дайджесты, но расследования, интервью и авторский стиль остаются за человеком.",
    skills: "Расследовательская журналистика, факт-чекинг, мультимедиа",
    src: [{ t: "Российская газета: Нейросеть ChatGPT о замене журналистов", u: "https://rg.ru/amp/2023/02/08/i-ty-bot.html" }, { t: "Sobaka-Perm: Как ChatGPT меняет журналистику", u: "https://sobaka-perm.ru/kak-chatgpt-menyaet-zhurnalistiku-i-sozdanie-kontenta/" }, { t: "Gipp: Что будет с журналистикой в эпоху искусственного интеллекта?", u: "https://www.gipp.ru/reviews/expert-opinions-interviews/chto-budet-s-zhurnalistikoj-v-epokhu-iskusstvennogo-intellekta" }, { t: "RUJ: Что будет с журналистикой в эпоху нейросетей и как с ними бороться", u: "https://ruj.ru/news/blogs/chto-budet-s-zhurnalistikoi-v-epokhu-neirosetei-i-kak-s-nimi-borotsya-23512" }, { t: "ACHBD: Заменят ли нейросети журналистов — обсудили с журналистами", u: "https://achbd.media/a/ai-and-professions-journalist" }] },
  { name: "Графический дизайнер", cat: "Творчество и медиа", risk: 55, trend: "трансформация",
    desc: "Midjourney, DALL-E генерируют изображения, но брендинг, UX-дизайн и концептуальная работа требуют человека. Роль меняется: от исполнителя к арт-директору ИИ.",
    skills: "Промпт-инжиниринг, UX/UI, арт-дирекция",
    src: [{ t: "Яндекс Практикум: Midjourney — облегчает ли нейросеть работу дизайнера", u: "https://practicum.yandex.ru/blog/kak-ispolzovat-midjourney-dizayneru/" }, { t: "DTF: Как ИИ влияет на работу Data Scientist", u: "https://dtf.ru/u4i-online/4015321-kak-ii-izmenyaet-professiyu-data-scientist-v-2025-godu" }, { t: "ITMO: Дизайн в эпоху ИИ: чему учиться дизайнеру сейчас, чтобы не остаться без работы", u: "https://news.itmo.ru/ru/news/14550" }, { t: "ArtPri: Влияние искусственного интеллекта на профессию “Графический дизайнер”", u: "https://artpri.ru/vliyanie-iskusstvennogo-intellekta-na-professiyu-graficheskij-dizajner" }] },
  { name: "Копирайтер", cat: "Творчество и медиа", risk: 65, trend: "замещение",
    desc: "ChatGPT и аналоги уже генерируют тексты приемлемого качества. Рутинный копирайтинг (SEO-тексты, описания) под угрозой. Выживут авторы с уникальным голосом.",
    skills: "Стратегия контента, сторителлинг, редактура ИИ-текстов",
    src: [{ t: "Skillbox: ChatGPT не заменит копирайтеров — мнение главредов", u: "https://skillbox.ru/media/marketing/zamenit-li-chatgpt-kopirayterov-sprosili-u-glavredov-i-rukovoditeley-agentstv/" }, { t: "Нетология: Как нейросети упрощают работу с текстом", u: "https://netology.ru/blog/10-2024-ai-for-texts" }, { t: "Lenta.ru: На российском рынке стало меньше вакансий для копирайтеров и редакторов", u: "https://lenta.ru/articles/2025/01/15/ii" }, { t: "VC: Заменит ли ИИ копирайтеров: жесткая правда о профессии в 2025 году", u: "https://vc.ru/top_rating/2280049-ii-i-kopirajtery-kak-izmenitsya-professiya-v-2025-godu" }, { t: "Kommersant: Спрос на копирайтеров и редакторов снизился из-за нейросетей", u: "https://www.kommersant.ru/doc/6952306" }] },
  { name: "Фотограф", cat: "Творчество и медиа", risk: 40, trend: "трансформация",
    desc: "ИИ генерирует фотореалистичные изображения, но репортажная, портретная и авторская фотография требуют человека.",
    skills: "Авторский стиль, работа с ИИ-обработкой, видео",
    src: [{ t: "DTF: Midjourney, DALL-E 3, Leonardo.ai — какую нейросеть выбрать", u: "https://dtf.ru/howto/4546314-midjourney-dall-e-3-leonardo-ai-kak-vybrat-neyroset" }, { t: "Penzasmi: Искусственный интеллект VS фотографы: как изменится рынок дизайна и фотографии", u: "https://penzasmi.ru/news/107816/iskusstvennyy-intellekt-vs-fotografy-kak-izmenitsya-rynok-dizayna-i-fotografii" }, { t: "TVTomsk: Томичам рассказали, когда нейросеть заменит фотографов", u: "https://www.tvtomsk.ru/news/112038-tomicham-rasskazali-kogda-nejroset-zamenit-professionalnyh-fotografov.html" }, { t: "ObozVRN: Екатерина Корнилова: «Нейросеть не заменит того, как видит тебя фотограф»", u: "https://obozvrn.ru/archives/282689" }, { t: "Sitv: Алгоритм красоты: как повлияли нейросети на работу современного фотографа", u: "https://sitv.ru/arhiv/news/algoritm-krasoty-kak-povliyali-nejroseti-na-rabotu-sovremennogo-fotografa" }] },
  { name: "Музыкант / композитор", cat: "Творчество и медиа", risk: 35, trend: "трансформация",
    desc: "ИИ создаёт фоновую музыку, но авторское творчество, живые выступления и эмоциональная глубина — за человеком.",
    skills: "Работа с ИИ-инструментами, живое исполнение, авторство",
    src: [{ t: "РБК Тренды: Музыка, создаваемая нейросетью — 8 примеров", u: "https://trends.rbc.ru/trends/industry/668e56409a79472586da205d" }, { t: "Хабр: Топ-10 нейросетей для написания песен", u: "https://habr.com/ru/companies/bothub/articles/960084/" }] },

  // Юриспруденция
  { name: "Юрист", cat: "Юриспруденция", risk: 35, trend: "трансформация",
    desc: "ИИ автоматизирует анализ документов и поиск прецедентов, но стратегия, переговоры и судебная защита — за человеком.",
    skills: "Работа с LegalTech, переговоры, стратегическое мышление",
    src: [{ t: "Известия: Как юристы используют ИИ", u: "https://iz.ru/1592744/alena-svetunkova/neironka-zakona-kak-iuristy-ispolzuiut-iskusstvennyi-intellekt" }, { t: "РБК Тренды: Как развивается Legal AI", u: "https://trends.rbc.ru/trends/innovation/687110ec9a79478fa6d8db5a" }, { t: "LegalTalents: Влияние искусственного интеллекта на юридическую профессию", u: "https://legaltalents.ru/tpost/2hsie8tpb1-vliyanie-iskusstvennogo-intellekta-na-yu" }, { t: "Kommersant: ИИ в юриспруденции: как технологии меняют работу юристов в России в 2025 году", u: "https://www.kommersant.ru/doc/8314886" }, { t: "You-Right: Заменит ли ИИ юристов? Будущее юридической профессии в эпоху искусственного интеллекта", u: "https://you-right.ru/stati/zamenit-li-iskusstvennyj-intellekt-yuristov" }] },
  { name: "Нотариус", cat: "Юриспруденция", risk: 50, trend: "трансформация",
    desc: "Электронный документооборот и цифровые подписи сокращают потребность в нотариальных действиях, но полное замещение невозможно из-за юридических требований.",
    skills: "Цифровые юридические сервисы",
    src: [{ t: "TAdviser: Электронный нотариат в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D1%82%D0%B0%D1%80%D0%B8%D0%B0%D1%82" }, { t: "Notariat.ru: Электронный документ через нотариуса", u: "https://notariat.ru/ru-ru/news/elektronnyj-dokument-proshe-i-dostupnee-cherez-notariusa" }, { t: "Notarius.ru: Нотариусы России обсудили возможность внедрения в свою работу нейросетей", u: "https://86.notariat.ru/ru-ru/news/enoty2024-2411" }, { t: "Tadviser: Цифровое развитие нотариата обсудили IT-специалисты нотариальных палат регионов", u: "https://xn----7sbbdtfmeshqmgwqmu6d3j.xn--p1ai/news/view?id=3912" }] },

  // Производство
  { name: "Оператор станка с ЧПУ", cat: "Производство", risk: 60, trend: "трансформация",
    desc: "Автоматизация производства идёт давно. ИИ добавляет предиктивное обслуживание и оптимизацию. Но наладка и контроль требуют человека.",
    skills: "Программирование ЧПУ, работа с ИИ-системами",
    src: [{ t: "ВШЭ: Роботизация станков с ЧПУ", u: "https://hsbi.hse.ru/articles/robotizatsiya-stankov-s-chpu/" }, { t: "TAdviser: Станкостроение в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A1%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }, { t: "Stankoff: Искусственный интеллект и ЧПУ: Революция точности", u: "https://www.stankoff.ru/blog/post/1504" }, { t: "LKPrototype: Заменят ли операторов и инженеров станков с ЧПУ искусственный интеллект?", u: "https://lkprototype.com/ru/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B8%D1%82-%D0%BB%D0%B8-%D0%98%D0%98-%D1%81%D1%82%D0%B0%D0%BD%D0%BA%D0%B8-%D1%81-%D0%A7%D0%9F%D0%A3" }] },
  { name: "Сварщик", cat: "Производство", risk: 45, trend: "трансформация",
    desc: "Роботы-сварщики используются на конвейерах, но ремонтная, строительная и нестандартная сварка требуют человека.",
    skills: "Сложная сварка, управление роботами",
    src: [{ t: "Forbes: Как в России растёт рынок промышленных роботов", u: "https://www.forbes.ru/tekhnologii/533789-deklaracia-nezavisimosti-kak-v-rossii-rastet-rynok-promyslennyh-robotov" }, { t: "IndPages: Искусственный интеллект в сварке", u: "https://indpages.ru/prom/iskusstvennyj-intellekt-v-svarke" }, { t: "SUSU: Искусственный интеллект на службе у сварщиков", u: "https://polytech-abit.susu.ru/tpost/u6839xuyb1-iskusstvennii-intellekt-na-sluzhbe-u-sva" }, { t: "MashNews: В Челябинске искусственный интеллект научился 'варить' сталь", u: "https://mashnews.ru/v-chelyabinske-iskusstvennyij-intellekt-nauchilsya-varit-stal.html" }, { t: "NN: Сварщик зарабатывает больше айтишника»: ИИ вытесняет нижегородцев из ИТ-сферы", u: "https://www.nn.ru/text/job/2025/04/01/75286466" }] },
  { name: "Кладовщик", cat: "Производство", risk: 80, trend: "замещение",
    desc: "Автоматизированные склады (Amazon, Ozon, Wildberries) массово внедряют роботов. Профессия под высоким риском.",
    skills: "Переквалификация: управление складской робототехникой",
    src: [{ t: "TAdviser: Складские роботы в Wildberries", u: "https://www.tadviser.ru/index.php/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82:%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4%D1%81%D0%BA%D0%B8%D0%B5_%D1%80%D0%BE%D0%B1%D0%BE%D1%82%D1%8B_%D0%B2_Wildberries" }, { t: "Shoppers: Автоматизация позволила Wildberries вдвое сократить наём", u: "https://shoppers.media/news/21951_avtomatizaciia-skladov-pozvolila-wildberries-vdvoe-sokratit-naem-rabocix" }, { t: "InteKey: Искусственный интеллект в складской логистике: глобальные тренды и российская реальность", u: "https://intekey.ru/articles/iskusstvennyy-intellekt-v-skladskoy-logistike-globalnye-trendy-i-rossiyskaya-realnost" }, { t: "OSN: Кладов: ИИ в ближайшие 20 лет заменит кассиров, бухгалтеров и водителей такси", u: "https://www.osnmedia.ru/obshhestvo/kladov-ii-v-blizhajshie-20-let-zamenit-kassirov-buhgalterov-i-voditelej-taksi" }, { t: "ITOB: Применение искусственного интеллекта в логистике: Кейсы российских компаний", u: "https://itob.ru/blog/primenenie-iskusstvennogo-intellekta-v-rossiyskoy-logistike" }] },

  // Торговля и сервис
  { name: "Кассир", cat: "Торговля и сервис", risk: 90, trend: "замещение",
    desc: "Кассы самообслуживания, бескассовые магазины (Яндекс Лавка, Магнит) — профессия стремительно исчезает.",
    skills: "Переквалификация: мерчандайзинг, клиентский сервис",
    src: [{ t: "Российская газета: В Москве открылись магазины без продавцов", u: "https://rg.ru/2024/08/29/reg-cfo/kto-hodit-nochiu-v-magazin.html" }, { t: "Ведомости: Fix Price установит 1000+ касс самообслуживания в 2024", u: "https://www.vedomosti.ru/press_releases/2024/02/20/fix-price-v-2024-godu-ustanovit-kassi-samoobsluzhivaniya-v-bolee-chem-1-tis-svoih-magazinov" }, { t: "Lenta.ru: В России предсказали влияние ИИ на профессии в будущем", u: "https://lenta.ru/news/2025/08/02/v-rossii-predskazali-vliyanie-ii-professii-v-buduschem" }, { t: "OSN: Кладов: ИИ в ближайшие 20 лет заменит кассиров, бухгалтеров и водителей такси", u: "https://www.osnmedia.ru/obshhestvo/kladov-ii-v-blizhajshie-20-let-zamenit-kassirov-buhgalterov-i-voditelej-taksi" }, { t: "RBC: Как ИИ влияет на транспорт во всем мире", u: "https://companies.rbc.ru/news/6W7vJfmeIW/byistree-bezopasnee-vyigodnee-kak-ii-vliyaet-na-transport-vo-vsem-mire" }] },
  { name: "Продавец-консультант", cat: "Торговля и сервис", risk: 60, trend: "трансформация",
    desc: "Онлайн-торговля и чат-боты сокращают спрос, но премиальные и сложные товары по-прежнему требуют человеческого консультирования.",
    skills: "Экспертные продажи, работа с CRM",
    src: [{ t: "Data Insight: Интернет-торговля в России 2024", u: "https://datainsight.ru/eCommerce_2023" }, { t: "Коммерсантъ: Оборот e-commerce в РФ превысил 10 трлн рублей", u: "https://www.kommersant.ru/doc/7248916" }, { t: "OlineContact: ИИ усиливает продавцов, а не заменяет их", u: "https://www.olinecontact.ru/articles/ii-usilivaet-prodavtsov-a-ne-zamenyaet-ikh" }, { t: "GorodRabot: Заменит ли искусственный интеллект работу продавца?", u: "https://gorodrabot.ru/article/1178" }, { t: "Kommersant: Востребованность ИИ-навыков на рынке труда России в 2025 году", u: "https://www.kommersant.ru/doc/8315813" }] },
  { name: "Официант", cat: "Торговля и сервис", risk: 30, trend: "трансформация",
    desc: "Роботы-официанты — скорее маркетинговый ход. Гостеприимство, сервис и адаптивность требуют человека.",
    skills: "Сервис, гостеприимство, работа с цифровыми системами заказов",
    src: [{ t: "TAdviser: Интернет-торговля в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BB%D1%8F_(%D1%80%D1%8B%D0%BD%D0%BE%D0%BA_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8)" }, { t: "Известия: Эксперт оценил влияние ИИ на сферу обслуживания", u: "https://iz.ru/1790170/2024-11-13/ekspert-otcenil-vliianie-ii-na-sferu-obsluzhivaniia" }, { t: "Secrets.TBank: ИИ в ресторанном бизнесе: как технологии спасают от номенклатурного хаоса", u: "https://secrets.tbank.ru/blogi-kompanij/ii-v-restorannom-biznese" }, { t: "RBC: Роботы-официанты — технологии автоматизации обслуживания гостей", u: "https://companies.rbc.ru/news/TGMmBqAHFw/robotyi-ofitsiantyi---tehnologii-avtomatizatsii-obsluzhivaniya-gostej" }] },
  { name: "Повар", cat: "Торговля и сервис", risk: 20, trend: "трансформация",
    desc: "ИИ помогает с рецептурой и оптимизацией меню, но приготовление еды — физический и творческий процесс.",
    skills: "Кулинарное мастерство, работа с ИИ-оптимизацией меню",
    src: [{ t: "Сбер: GigaChat для HoReCa", u: "https://developers.sber.ru/help/gigachat-api/ai-in-logistics" }, { t: "Kommersant: Шеф-повара объединяются с ИИ", u: "https://www.kommersant.ru/doc/7888802" }, { t: "Championat: Эксперт рассказал о пяти профессиях, которые никогда не будут заменены ИИ", u: "https://www.championat.com/lifestyle/news-5594024-ekspert-rasskazal-o-pyati-professiyah-kotorye-nikogda-ne-budut-zameneny-ii.html" }] },
  { name: "Администратор отеля", cat: "Торговля и сервис", risk: 55, trend: "трансформация",
    desc: "Онлайн-бронирование и чат-боты автоматизируют рутину, но гостеприимство и решение нестандартных ситуаций — за человеком.",
    skills: "Клиентский сервис, работа с системами бронирования",
    src: [{ t: "TAdviser: Цифровизация в HoReCa", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BB%D1%8F_(%D1%80%D1%8B%D0%BD%D0%BE%D0%BA_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8)" }, { t: "WelcomeTimes: Как искусственный интеллект повлияет на работу российских отелей", u: "https://welcometimes.ru/opinions/kak-iskusstvennyy-intellekt-povliyaet-na-rabotu-rossiyskih-oteley" }, { t: "Hotelier.PRO: ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ НА СЛУЖБЕ ГОСТИНИЧНОГО ДЕЛА", u: "https://hotelier.pro/interviews/item/iskusstvennyy-intellekt-na-sluzhbe-gostinichnogo-dela" }, { t: "REA: Сможет ли искусственный интеллект заменить человека в сфере бронирования отелей", u: "https://www.rea.ru/structure/hs/vyisshaya-shkola-menedjmenta/49938-smojet-li-iskusstvennyiy-intellekt-zamenit-cheloveka-v-sfere-bronirovaniya-oteley" }, { t: "HospitalityGuide: Искусственный интеллект в отеле. Многоточие", u: "https://hospitalityguide.ru/articles/equipment/iskusstvennyj-intellekt-v-otele-mnogotochie" }] },

  // Наука
  { name: "Учёный-исследователь", cat: "Наука", risk: 10, trend: "рост",
    desc: "ИИ — мощный инструмент для исследований (анализ данных, моделирование), но постановка гипотез, интерпретация и научная интуиция — за человеком.",
    skills: "Работа с ИИ-инструментами, междисциплинарность",
    src: [{ t: "TAdviser: Исследования ИИ в России", u: "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%98%D1%81%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE_%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%B0_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8" }, { t: "НИУ ВШЭ: Институт искусственного интеллекта", u: "https://cs.hse.ru/iai/" }, { t: "Trends.RBC: Что происходит с наукой и учеными в эпоху ИИ", u: "https://trends.rbc.ru/trends/innovation/cmrm/69825a149a794778742c1e67" }, { t: "НИУ ВШЭ: ИИ в науке: страхи и чаяния российских ученых", u: "https://www.hse.ru/news/priority/1113227187.html" }, { t: "NaukaTV: Как искусственный интеллект применяется в науке — рассказали российские ученые", u: "https://naukatv.ru/articles/ii_v_nauke_mnenie_uchenykh" }] },
  { name: "Переводчик", cat: "Наука", risk: 70, trend: "замещение",
    desc: "Нейросетевой перевод (DeepL, Яндекс Переводчик) достиг высокого качества. Рутинный перевод автоматизирован. Остаётся художественный и узкоспециальный перевод.",
    skills: "Художественный перевод, редактура машинного перевода, локализация",
    src: [{ t: "Хабр: Обзор движков машинного перевода — Яндекс, Google, DeepL", u: "https://habr.com/ru/articles/852810/" }, { t: "VVSU: Быть или не быть переводчиком в 2025 году", u: "https://www.vvsu.ru/news/208239" }, { t: "RB: 4 из 10 переводчиков теряют работу из-за ИИ — опрос", u: "https://rb.ru/stories/translators-losing-work-to-ai" }, { t: "RBC: Как ИИ снимает языковые барьеры, и нужны ли теперь люди-переводчики", u: "https://companies.rbc.ru/news/CVjuhKPXEz/kak-ii-snimaet-yazyikovyie-bareryi-i-nuzhnyi-li-teper-lyudi-perevodchiki" }] },
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

const ProfessionModal = ({ profession, open, onClose, onPrev, onNext, hasPrev, hasNext }) => {
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

        {/* Navigation panel */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1"
          >
            Вперёд
            <ChevronRight className="h-4 w-4" />
          </Button>
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

// Generate all variations: 1-3 "Ай" + 1-3 "Ой"
const LOGO_VARIATIONS = [];
for (let ai = 1; ai <= 3; ai++) {
  for (let oi = 1; oi <= 3; oi++) {
    LOGO_VARIATIONS.push("Ай".repeat(ai) + "Ой".repeat(oi));
  }
}

const AnimatedLogoText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOGO_VARIATIONS.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-lg font-bold text-foreground inline-block min-w-[120px]">
      {LOGO_VARIATIONS[index]}
    </span>
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [sort, setSort] = useState("risk-desc");
  const [selectedIndex, setSelectedIndex] = useState(null);

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
      {/* Logo */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="АйОй" style={{ maxHeight: 42 }} />
          <AnimatedLogoText />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12 md:py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            ИИ и Занятость
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Замещение труда или его трансформация?<br />Узнайте, как ИИ повлияет на вашу будущую профессию
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
              onClick={() => setSelectedIndex(i)}
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
            &copy; Марк Коротков · 2026
          </p>
          <p className="text-[10px] text-muted/60 mt-1">
            Данные основаны на анализе открытых источников. Оценки носят ориентировочный характер.
          </p>
        </footer>
      </div>

      <ProfessionModal
        profession={selectedIndex !== null ? filtered[selectedIndex] : null}
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => setSelectedIndex(i => i > 0 ? i - 1 : i)}
        onNext={() => setSelectedIndex(i => i < filtered.length - 1 ? i + 1 : i)}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < filtered.length - 1}
      />
    </div>
  );
}
