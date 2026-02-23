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
    src: [{ t: "РБК: Как ИИ меняет работу программистов", u: "https://www.rbc.ru" }, { t: "Хабр: Будущее разработки с ИИ", u: "https://habr.com" }] },
  { name: "Системный администратор", cat: "IT и технологии", risk: 45, trend: "трансформация",
    desc: "Облачные технологии и ИИ-мониторинг автоматизируют рутинные задачи администрирования. Роль смещается в сторону DevOps и облачной инфраструктуры.",
    skills: "Облачные платформы, DevOps, автоматизация",
    src: [{ t: "CNews: Автоматизация IT-инфраструктуры", u: "https://www.cnews.ru" }] },
  { name: "Тестировщик ПО", cat: "IT и технологии", risk: 55, trend: "трансформация",
    desc: "Автоматическое тестирование с помощью ИИ заменяет ручное. Но тест-дизайн, UX-тестирование и сложные сценарии требуют человека.",
    skills: "Автоматизация тестирования, аналитика, ИИ-инструменты",
    src: [{ t: "Хабр: ИИ в тестировании", u: "https://habr.com" }] },
  { name: "Специалист по данным (Data Scientist)", cat: "IT и технологии", risk: 15, trend: "рост",
    desc: "Одна из самых востребованных профессий. ИИ — это инструмент работы, а не конкурент. Спрос только растёт.",
    skills: "Машинное обучение, статистика, Python, визуализация данных",
    src: [{ t: "HeadHunter: Обзор рынка Data Science в России", u: "https://hh.ru" }] },

  // Финансы
  { name: "Бухгалтер", cat: "Финансы", risk: 75, trend: "замещение",
    desc: "Автоматизация учёта, электронный документооборот и ИИ-системы (1С, SAP) уже заменяют значительную часть рутинных операций. Останутся сложные задачи: аудит, налоговое планирование.",
    skills: "Налоговое консультирование, аудит, работа с ИИ-системами",
    src: [{ t: "Ведомости: Автоматизация бухгалтерии", u: "https://www.vedomosti.ru" }, { t: "1С: Искусственный интеллект в учёте", u: "https://1c.ru" }] },
  { name: "Финансовый аналитик", cat: "Финансы", risk: 40, trend: "трансформация",
    desc: "ИИ обрабатывает большие массивы данных быстрее, но интерпретация, стратегические решения и переговоры остаются за человеком.",
    skills: "Стратегический анализ, ИИ-аналитика, коммуникации",
    src: [{ t: "РБК: ИИ в финансовом секторе России", u: "https://www.rbc.ru" }] },
  { name: "Банковский операционист", cat: "Финансы", risk: 85, trend: "замещение",
    desc: "Онлайн-банкинг, чат-боты и ИИ-системы уже сократили количество операционистов в банках на 30–40% за последние 5 лет.",
    skills: "Переквалификация: финтех, клиентский сервис высокого уровня",
    src: [{ t: "ТАСС: Сбербанк сокращает отделения", u: "https://tass.ru" }] },
  { name: "Страховой агент", cat: "Финансы", risk: 70, trend: "замещение",
    desc: "Онлайн-страхование и ИИ-оценка рисков сокращают потребность в агентах. Сложные корпоративные продукты пока требуют человека.",
    skills: "Консультирование, корпоративное страхование",
    src: [{ t: "Коммерсантъ: Цифровизация страхования", u: "https://www.kommersant.ru" }] },

  // Медицина
  { name: "Врач-терапевт", cat: "Медицина", risk: 20, trend: "трансформация",
    desc: "ИИ помогает в диагностике (анализ снимков, симптомов), но общение с пациентом, принятие решений и ответственность остаются за врачом.",
    skills: "Работа с ИИ-диагностикой, эмпатия, комплексное мышление",
    src: [{ t: "Медвестник: ИИ в российской медицине", u: "https://medvestnik.ru" }, { t: "ТАСС: Нейросети в здравоохранении", u: "https://tass.ru" }] },
  { name: "Врач-радиолог", cat: "Медицина", risk: 50, trend: "трансформация",
    desc: "ИИ уже распознаёт патологии на снимках точнее среднего радиолога. Но финальное решение и ответственность — за врачом. Роль меняется: от чтения снимков к супервизии ИИ.",
    skills: "Контроль ИИ-систем, сложная диагностика",
    src: [{ t: "N+1: Нейросети в радиологии", u: "https://nplus1.ru" }] },
  { name: "Медсестра / медбрат", cat: "Медицина", risk: 10, trend: "рост",
    desc: "Требует физического присутствия, эмпатии, адаптивности. ИИ практически не влияет. Дефицит кадров растёт.",
    skills: "Уход за пациентами, работа с медтехникой",
    src: [{ t: "Росстат: Дефицит медперсонала", u: "https://rosstat.gov.ru" }] },
  { name: "Фармацевт", cat: "Медицина", risk: 60, trend: "трансформация",
    desc: "Автоматизация выдачи лекарств и онлайн-аптеки сокращают спрос. Но консультирование и рецептурные препараты требуют специалиста.",
    skills: "Фармконсультирование, работа с цифровыми системами",
    src: [{ t: "Фармвестник: Автоматизация аптек", u: "https://pharmvestnik.ru" }] },

  // Образование
  { name: "Учитель школы", cat: "Образование", risk: 15, trend: "трансформация",
    desc: "ИИ-тьюторы и адаптивные платформы дополняют, но не заменяют учителя. Воспитание, мотивация, социализация — уникальные человеческие функции.",
    skills: "Цифровая педагогика, работа с ИИ-платформами, эмоциональный интеллект",
    src: [{ t: "Минпросвещения: Цифровая трансформация образования", u: "https://edu.gov.ru" }] },
  { name: "Репетитор", cat: "Образование", risk: 55, trend: "трансформация",
    desc: "ИИ-тьюторы (ChatGPT, Яндекс Учебник) берут на себя объяснение типовых задач. Но подготовка к ЕГЭ, мотивация и индивидуальный подход пока требуют человека.",
    skills: "Методика, мотивация, работа с ИИ-инструментами",
    src: [{ t: "Яндекс Образование: ИИ в обучении", u: "https://education.yandex.ru" }] },
  { name: "Преподаватель вуза", cat: "Образование", risk: 25, trend: "трансформация",
    desc: "Лекции можно записать, но научное руководство, дискуссии и исследования требуют человека.",
    skills: "Исследования, научное руководство, критическое мышление",
    src: [{ t: "НИУ ВШЭ: Будущее высшего образования", u: "https://hse.ru" }] },

  // Транспорт и логистика
  { name: "Водитель такси", cat: "Транспорт и логистика", risk: 70, trend: "замещение",
    desc: "Беспилотные автомобили уже тестируются в Москве (Яндекс). Полное замещение — вопрос 10–15 лет, но процесс идёт.",
    skills: "Переквалификация: логистика, техобслуживание беспилотников",
    src: [{ t: "Яндекс: Беспилотные автомобили", u: "https://sdg.yandex.ru" }, { t: "Коммерсантъ: Будущее такси", u: "https://www.kommersant.ru" }] },
  { name: "Водитель-дальнобойщик", cat: "Транспорт и логистика", risk: 65, trend: "замещение",
    desc: "Автономные грузовики — приоритет для логистических компаний. Но сложные дорожные условия России замедляют внедрение.",
    skills: "Управление автономным транспортом, логистика",
    src: [{ t: "КАМАЗ: Беспилотные грузовики", u: "https://kamaz.ru" }] },
  { name: "Логист", cat: "Транспорт и логистика", risk: 50, trend: "трансформация",
    desc: "ИИ оптимизирует маршруты и склады, но управление сложными цепочками поставок и форс-мажорами — за человеком.",
    skills: "ИИ-оптимизация, управление цепочками поставок",
    src: [{ t: "Логирус: ИИ в логистике", u: "https://logirus.ru" }] },
  { name: "Курьер", cat: "Транспорт и логистика", risk: 60, trend: "замещение",
    desc: "Роботы-курьеры (Яндекс Ровер) и дроны тестируются, но массовое внедрение займёт годы. Пока спрос на курьеров растёт.",
    skills: "Переквалификация: управление роботами-доставщиками",
    src: [{ t: "Яндекс: Роботы-доставщики", u: "https://rover.yandex.ru" }] },

  // Творчество и медиа
  { name: "Журналист", cat: "Творчество и медиа", risk: 45, trend: "трансформация",
    desc: "ИИ генерирует новостные заметки и дайджесты, но расследования, интервью и авторский стиль остаются за человеком.",
    skills: "Расследовательская журналистика, факт-чекинг, мультимедиа",
    src: [{ t: "Журналист: ИИ в медиа", u: "https://jrnlst.ru" }] },
  { name: "Графический дизайнер", cat: "Творчество и медиа", risk: 55, trend: "трансформация",
    desc: "Midjourney, DALL-E генерируют изображения, но брендинг, UX-дизайн и концептуальная работа требуют человека. Роль меняется: от исполнителя к арт-директору ИИ.",
    skills: "Промпт-инжиниринг, UX/UI, арт-дирекция",
    src: [{ t: "vc.ru: Как нейросети меняют дизайн", u: "https://vc.ru" }] },
  { name: "Копирайтер", cat: "Творчество и медиа", risk: 65, trend: "замещение",
    desc: "ChatGPT и аналоги уже генерируют тексты приемлемого качества. Рутинный копирайтинг (SEO-тексты, описания) под угрозой. Выживут авторы с уникальным голосом.",
    skills: "Стратегия контента, сторителлинг, редактура ИИ-текстов",
    src: [{ t: "vc.ru: Смерть копирайтинга?", u: "https://vc.ru" }] },
  { name: "Фотограф", cat: "Творчество и медиа", risk: 40, trend: "трансформация",
    desc: "ИИ генерирует фотореалистичные изображения, но репортажная, портретная и авторская фотография требуют человека.",
    skills: "Авторский стиль, работа с ИИ-обработкой, видео",
    src: [{ t: "Фотосклад: ИИ и фотография", u: "https://fotosklad.ru" }] },
  { name: "Музыкант / композитор", cat: "Творчество и медиа", risk: 35, trend: "трансформация",
    desc: "ИИ создаёт фоновую музыку, но авторское творчество, живые выступления и эмоциональная глубина — за человеком.",
    skills: "Работа с ИИ-инструментами, живое исполнение, авторство",
    src: [{ t: "Colta.ru: Нейросети и музыка", u: "https://colta.ru" }] },

  // Юриспруденция
  { name: "Юрист", cat: "Юриспруденция", risk: 35, trend: "трансформация",
    desc: "ИИ автоматизирует анализ документов и поиск прецедентов, но стратегия, переговоры и судебная защита — за человеком.",
    skills: "Работа с LegalTech, переговоры, стратегическое мышление",
    src: [{ t: "Право.ru: ИИ в юриспруденции", u: "https://pravo.ru" }] },
  { name: "Нотариус", cat: "Юриспруденция", risk: 50, trend: "трансформация",
    desc: "Электронный документооборот и цифровые подписи сокращают потребность в нотариальных действиях, но полное замещение невозможно из-за юридических требований.",
    skills: "Цифровые юридические сервисы",
    src: [{ t: "Нотариат.ru: Цифровизация", u: "https://notariat.ru" }] },

  // Производство
  { name: "Оператор станка с ЧПУ", cat: "Производство", risk: 60, trend: "трансформация",
    desc: "Автоматизация производства идёт давно. ИИ добавляет предиктивное обслуживание и оптимизацию. Но наладка и контроль требуют человека.",
    skills: "Программирование ЧПУ, работа с ИИ-системами",
    src: [{ t: "Стан.ру: Автоматизация производства", u: "https://stanki.ru" }] },
  { name: "Сварщик", cat: "Производство", risk: 45, trend: "трансформация",
    desc: "Роботы-сварщики используются на конвейерах, но ремонтная, строительная и нестандартная сварка требуют человека.",
    skills: "Сложная сварка, управление роботами",
    src: [{ t: "Промышленный вестник: Роботизация сварки", u: "https://promvest.info" }] },
  { name: "Кладовщик", cat: "Производство", risk: 80, trend: "замещение",
    desc: "Автоматизированные склады (Amazon, Ozon, Wildberries) массово внедряют роботов. Профессия под высоким риском.",
    skills: "Переквалификация: управление складской робототехникой",
    src: [{ t: "Ozon Tech: Роботизация складов", u: "https://tech.ozon.ru" }] },

  // Торговля и сервис
  { name: "Кассир", cat: "Торговля и сервис", risk: 90, trend: "замещение",
    desc: "Кассы самообслуживания, бескассовые магазины (Яндекс Лавка, Магнит) — профессия стремительно исчезает.",
    skills: "Переквалификация: мерчандайзинг, клиентский сервис",
    src: [{ t: "РБК: Магазины без касс в России", u: "https://www.rbc.ru" }, { t: "Яндекс Лавка: Технологии", u: "https://lavka.yandex.ru" }] },
  { name: "Продавец-консультант", cat: "Торговля и сервис", risk: 60, trend: "трансформация",
    desc: "Онлайн-торговля и чат-боты сокращают спрос, но премиальные и сложные товары по-прежнему требуют человеческого консультирования.",
    skills: "Экспертные продажи, работа с CRM",
    src: [{ t: "Data Insight: E-commerce в России", u: "https://datainsight.ru" }] },
  { name: "Официант", cat: "Торговля и сервис", risk: 30, trend: "трансформация",
    desc: "Роботы-официанты — скорее маркетинговый ход. Гостеприимство, сервис и адаптивность требуют человека.",
    skills: "Сервис, гостеприимство, работа с цифровыми системами заказов",
    src: [{ t: "Restoclub: Технологии в ресторанах", u: "https://www.restoclub.ru" }] },
  { name: "Повар", cat: "Торговля и сервис", risk: 20, trend: "трансформация",
    desc: "ИИ помогает с рецептурой и оптимизацией меню, но приготовление еды — физический и творческий процесс.",
    skills: "Кулинарное мастерство, работа с ИИ-оптимизацией меню",
    src: [{ t: "Foodservice: Технологии на кухне", u: "https://foodservice.ru" }] },
  { name: "Администратор отеля", cat: "Торговля и сервис", risk: 55, trend: "трансформация",
    desc: "Онлайн-бронирование и чат-боты автоматизируют рутину, но гостеприимство и решение нестандартных ситуаций — за человеком.",
    skills: "Клиентский сервис, работа с системами бронирования",
    src: [{ t: "Hotelier.pro: Цифровизация гостиниц", u: "https://hotelier.pro" }] },

  // Наука
  { name: "Учёный-исследователь", cat: "Наука", risk: 10, trend: "рост",
    desc: "ИИ — мощный инструмент для исследований (анализ данных, моделирование), но постановка гипотез, интерпретация и научная интуиция — за человеком.",
    skills: "Работа с ИИ-инструментами, междисциплинарность",
    src: [{ t: "N+1: ИИ в науке", u: "https://nplus1.ru" }, { t: "НИУ ВШЭ: ИИ и научные исследования", u: "https://hse.ru" }] },
  { name: "Переводчик", cat: "Наука", risk: 70, trend: "замещение",
    desc: "Нейросетевой перевод (DeepL, Яндекс Переводчик) достиг высокого качества. Рутинный перевод автоматизирован. Остаётся художественный и узкоспециальный перевод.",
    skills: "Художественный перевод, редактура машинного перевода, локализация",
    src: [{ t: "Яндекс: Нейросетевой перевод", u: "https://translate.yandex.ru" }] },
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
