export interface Filter {
  matches(object: Object): boolean;
  render();
}

export interface CompoundFilter extends Filter {
  compositeHasChanged(): void;
}
