import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD_FULL, PRESIDENTS } from './photos';
import { BOARD_LINES } from './stories';

const CHIP_TINTS = ['bg-plum text-white', 'bg-mint text-ink', 'bg-gold text-ink', 'bg-rose text-white'];

/* The board, photo-first: president anchors the grid at 2×2, everyone else
 * gets a large sticker portrait. Only the president is bigger. */
export function BoardSection() {
  const [president, ...rest] = BOARD_FULL;
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <Reveal className="col-span-2 row-span-2">
        <article className="group suk-shadow-pink relative h-full min-h-[420px] overflow-hidden rounded-[2rem] border-2 border-ink bg-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-1 md:min-h-[560px]">
          <img
            src={president.img}
            alt={president.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rotate-[-3deg] rounded-full border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold text-ink uppercase suk-shadow-sm">
            {president.role} · 2026-27
          </span>
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border-2 border-ink bg-white p-4 suk-shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink md:text-3xl">{president.name.replace('Rtr. ', '')}</h3>
            {BOARD_LINES[president.role] && (
              <p className="mt-1 text-sm font-semibold text-mut italic">{BOARD_LINES[president.role]}</p>
            )}
          </div>
        </article>
      </Reveal>

      {rest.map((p, i) => (
        <Reveal key={p.name} delay={(i % 4) * 80} className="h-full">
          <article className="group flex h-full flex-col rounded-3xl border-2 border-ink bg-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1.5 hover:rotate-1">
            <div className="overflow-hidden rounded-t-[1.375rem]">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-3.5 md:p-4">
              <span className={`self-start rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase -rotate-1 ${CHIP_TINTS[i % 4]}`}>
                {p.role}
              </span>
              <h3 className="mt-2 font-display text-base leading-tight font-bold text-ink">{p.name.replace('Rtr. ', '')}</h3>
              {BOARD_LINES[p.role] && (
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-mut italic">{BOARD_LINES[p.role]}</p>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* A Line of Leadership: the eight presidents, in two tidy rows of four. */
export function PresidentsRail() {
  return (
    <section className="w-full overflow-hidden border-y-2 border-ink bg-plum py-12 text-white md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-8 md:mb-10 md:flex md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-gold px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
              <Crown className="size-4" strokeWidth={2.5} /> A line of leadership
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase md:text-5xl">
              Eight presidents. Two rows. One club.
            </h2>
          </div>
          <p className="mt-3 hidden text-sm font-semibold text-white/70 md:block">
            Every term since charter — 2019 to today.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-7">
          {PRESIDENTS.map((p) => (
            <article
              key={p.term}
              className="group rounded-3xl border-2 border-ink bg-white text-ink shadow-[6px_6px_0_0_rgba(30,41,59,1)] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-2 hover:-rotate-1"
            >
              <div className="overflow-hidden rounded-t-[1.375rem]">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4">
                <p className="font-display text-sm font-bold text-ink md:text-base">{p.name.replace('Rtr. ', '')}</p>
                <p className="mt-1.5 inline-block rounded-full border-2 border-ink bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">
                  {p.term}
                </p>
                {p.current && (
                  <p className="mt-1.5 inline-block rounded-full border-2 border-ink bg-rose px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    Current president
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}