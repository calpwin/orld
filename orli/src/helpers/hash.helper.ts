import { CElement } from "../features/ui-editor/celement/celement";
import { CElementHash } from "../features/ui-editor/editor.state";

export class HashHelpers {
  public static toEntries(celsHash: CElementHash) {
    return Object.entries(celsHash);
  }

  public static create(entries: [string, CElement][]) {
    const hash: CElementHash = {};
    for (const [key, value] of entries) {
      hash[key] = value;
    }

    return hash;
  }

  public static deepCopy(hash: CElementHash) {
    const entries = this.toEntries(hash);
    const newHash = this.create(entries);

    return newHash;
  }

  public static overrideOne(hash: CElementHash, cel: CElement) {
    const cels = HashHelpers.toEntries(hash).filter((x) => x[1].id != cel.id);
    const newHash = HashHelpers.create(cels);
    newHash[cel.id] = cel;

    return newHash;
  }
}
