interface Mediator {
  notify(sender: object, event: string): void;
}

export default Mediator;
