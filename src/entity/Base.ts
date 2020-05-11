export interface BaseEntity<S> {
  commit(): Promise<this>;

  serialize(): Promise<S>;
}
