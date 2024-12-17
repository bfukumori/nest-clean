import { type AggregateRoot } from "../entities/aggregate-root";
import { type UniqueEntityID } from "../entities/unique-entity-id";
import { type DomainEvent } from "./domain-event";

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: Array<AggregateRoot<unknown>> = [];

  public static markAggregateForDispatch(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const aggregateFound = Boolean(this.findMarkedAggregateByID(aggregate.id));

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(
    aggregate: AggregateRoot<unknown>,
  ): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => {
      this.dispatch(event);
    });
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate !== undefined) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ): void {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
