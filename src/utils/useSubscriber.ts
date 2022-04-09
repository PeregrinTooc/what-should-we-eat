import { useEffect } from "react";

export interface Publisher{
subscribe(observer: Function): void
unsubscribe(observer: Function): void
publish(): void
observers: Function[]
}

class PublisherImpl implements Publisher{
  subscribe(observer: Function): void {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
    }
  }
  unsubscribe(observer: Function): void {
    this.observers = this.observers.filter((f) => {
      return f !== observer;
    });
  }
  publish(): void {
    this.observers.forEach((f) => {
      f(this);
    });
  }
  observers: Function[];
}

export const defaultPublisher=new PublisherImpl()

export function useSubscriber(publisher: Publisher, observer: Function) {
  useEffect(() => {
    publisher.subscribe(observer);
    return function cleanup() {
      publisher.unsubscribe(observer);
    };
  }, [publisher, observer]);
}
