type EventHandler = (...args: any[]) => void

class EventBus {
  private events: Map<string, EventHandler[]> = new Map()

  on(event: string, handler: EventHandler): void {
    const handlers = this.events.get(event) || []
    handlers.push(handler)
    this.events.set(event, handlers)
  }

  off(event: string, handler?: EventHandler): void {
    if (!handler) {
      this.events.delete(event)
      return
    }

    const handlers = this.events.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }

  once(event: string, handler: EventHandler): void {
    const wrapper = (...args: any[]) => {
      handler(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
}

export const eventBus = new EventBus()
