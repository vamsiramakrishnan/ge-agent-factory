// Scenario-pack → simulator bridge derivation for the mock-data planner. Matches
// scenario packs to a use case and projects their simulator interop into bridge
// records attached to the use-case spec. Extracted from plan-mock-data.mjs verbatim.

import { snakeCase } from "@ge/std/naming";
import { matchScenarioPacks } from "../packs/index.mjs";
import { columnSet, entitiesFor } from "./lakehouse-targets.mjs";

export function buildPackBridgeContext(useCase) {
  const spec = useCase.generationSpec || {};
  const sourceSystems = spec.sourceSystems?.length
    ? spec.sourceSystems
    : (useCase.sources || []).map((source) => ({
      id: snakeCase(source.system),
      name: source.system,
      description: source.description,
    }));
  const entities = spec.entities?.length
    ? spec.entities
    : (useCase.sources || []).flatMap((source) => entitiesFor(source).map((name) => ({ name, columns: columnSet(name).map((column) => ({ name: column })) })));
  return {
    schema: {
      domain: useCase.department || "general",
      systems: sourceSystems,
      tables: entities.map((entity) => ({
        name: entity.name,
        columns: entity.columns || [],
        _sourceSystemId: entity.sourceSystemId,
      })),
      useCaseSpec: {
        id: useCase.id,
        title: useCase.title,
        department: useCase.department,
        behaviorContract: spec.behaviorContract || null,
      },
    },
    contract: spec.behaviorContract || null,
    employeeIds: [],
  };
}

export function packBridgesForUseCase(useCase) {
  return matchScenarioPacks(buildPackBridgeContext(useCase))
    .filter((pack) => pack.simulatorInterop)
    .map((pack) => ({
      packId: pack.id,
      simulatorArchetypes: pack.simulatorInterop.archetypes || [],
      simulatorCollections: pack.simulatorInterop.collections || [],
      materializes: pack.simulatorInterop.materializes || "scenario fixtures into simulator seed overlays",
    }));
}

export function attachPackBridgesToUseCase(useCase, packBridges) {
  if (!useCase.generationSpec?.behaviorContract) return { ...useCase, packBridges };
  return {
    ...useCase,
    packBridges,
    generationSpec: {
      ...useCase.generationSpec,
      behaviorContract: {
        ...useCase.generationSpec.behaviorContract,
        simulatorEnrichment: {
          ...(useCase.generationSpec.behaviorContract.simulatorEnrichment || {}),
          packBridges,
        },
      },
    },
  };
}
