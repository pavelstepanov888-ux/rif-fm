import { useEffect, useRef, useState } from 'react';
import { asset } from '../assets';
import { Button, Dialog } from './ui';

const topics = [
  { title: 'Заказать песню', placeholder: 'Напишите исполнителя и название песни' },
  { title: 'Передать привет', placeholder: 'Кому передать привет и что сказать?' },
  { title: 'Поздравить', placeholder: 'Кого и с чем поздравить?' },
  { title: 'Написать ведущему', placeholder: 'Что хотите сказать ведущему?' },
  { title: 'Задать вопрос гостю', placeholder: 'Что хотите спросить у гостя?' },
  { title: 'Рассказать историю', placeholder: 'Расскажите вашу историю' },
  { title: 'Предложить тему', placeholder: 'О чём нам поговорить в эфире?' },
] as const;

export function WriteToAir({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState<(typeof topics)[number] | null>(null);
  const [messages, setMessages] = useState<Partial<Record<(typeof topics)[number]['title'], string>>>({});
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const title = submitted ? 'Спасибо за сообщение!' : topic?.title ?? 'Написать в эфир';
  const heading = useRef<HTMLHeadingElement>(null);
  const message = topic ? messages[topic.title] ?? '' : '';
  const canSubmit = message.trim() !== '' && name.trim() !== '';

  useEffect(() => {
    heading.current?.closest('dialog')?.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [title]);

  return <Dialog label={title} onClose={onClose} className="write-to-air" animated>
    {close => <div className="write-to-air__content">
      <div className="write-to-air__handle" aria-hidden="true" />
      <div className="write-to-air__header">
        {topic && !submitted && <Button type="button" variant="secondary" icon="chevron-down" iconOnly className="write-to-air__back" aria-label="К выбору темы" onClick={() => setTopic(null)} />}
        {!submitted && <h2 ref={heading} tabIndex={-1}>{title}</h2>}
        <Button type="button" variant="secondary" icon="close" iconOnly aria-label="Закрыть" onClick={close} />
      </div>
      {submitted ? <div className="write-to-air__confirmation">
        <img className="write-to-air__confirmation-art" src={asset('write-to-air-confirmation.webp')} alt="" width={960} height={514} />
        <div className="write-to-air__confirmation-copy">
          <h2 ref={heading} tabIndex={-1}>{title}</h2>
          <p>До встречи в эфире Риф FM!</p>
        </div>
        <Button type="button" onClick={close}>Хорошо</Button>
      </div> : topic ? <form className="write-to-air__form" onSubmit={event => {
        event.preventDefault();
        if (canSubmit) setSubmitted(true);
      }}>
        <label className="write-to-air__message" data-message={message}>
          <span>Сообщение</span>
          <textarea rows={4} required value={message} placeholder={topic.placeholder} onChange={event => setMessages({ ...messages, [topic.title]: event.currentTarget.value })} />
        </label>
        <label>
          <span>Имя</span>
          <input type="text" required autoComplete="given-name" value={name} placeholder="Как к вам обращаться" onChange={event => setName(event.currentTarget.value)} />
        </label>
        <Button type="submit" disabled={!canSubmit}>Отправить</Button>
      </form> : <ul className="write-to-air__topics" aria-label="Выберите тему">
        {topics.map(item => <li key={item.title}>
          <Button type="button" variant="tertiary" iconRight="chevron-down" onClick={() => setTopic(item)}>{item.title}</Button>
        </li>)}
      </ul>}
    </div>}
  </Dialog>;
}
