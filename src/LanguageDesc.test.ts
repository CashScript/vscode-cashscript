import {
  GLOBAL_FUNCTIONS,
  INSTANTIATIONS,
  TYPECASTS,
  LANGUAGE,
  DOT_COMPLETIONS
} from './LanguageDesc';

describe('LanguageDesc', () => {
  describe('GLOBAL_FUNCTIONS', () => {
    it('should contain expected global functions', () => {
      expect(GLOBAL_FUNCTIONS).toBeDefined();
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('abs');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('min');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('max');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('within');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('ripemd160');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('sha1');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('sha256');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('hash160');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('hash256');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('checkSig');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('checkMultiSig');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('checkDataSig');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('require');
      expect(Object.keys(GLOBAL_FUNCTIONS)).toContain('console.log');
    });

    it('should have code and codeDesc for each global function', () => {
      const funcNames = Object.keys(GLOBAL_FUNCTIONS);
      for (const name of funcNames) {
        const func = GLOBAL_FUNCTIONS[name];
        expect(func).toHaveProperty('code');
        expect(func).toHaveProperty('codeDesc');
        expect(typeof func.code).toBe('string');
        expect(typeof func.codeDesc).toBe('string');
      }
    });
  });

  describe('INSTANTIATIONS', () => {
    it('should contain expected instantiations', () => {
      expect(INSTANTIATIONS).toBeDefined();
      expect(Object.keys(INSTANTIATIONS)).toContain('LockingBytecodeP2PKH');
      expect(Object.keys(INSTANTIATIONS)).toContain('LockingBytecodeP2SH20');
      expect(Object.keys(INSTANTIATIONS)).toContain('LockingBytecodeP2SH32');
      expect(Object.keys(INSTANTIATIONS)).toContain('LockingBytecodeNullData');
    });

    it('should have code and codeDesc for each instantiation', () => {
      const instNames = Object.keys(INSTANTIATIONS);
      for (const name of instNames) {
        const inst = INSTANTIATIONS[name];
        expect(inst).toHaveProperty('code');
        expect(inst).toHaveProperty('codeDesc');
        expect(typeof inst.code).toBe('string');
        expect(typeof inst.codeDesc).toBe('string');
      }
    });
  });

  describe('TYPECASTS', () => {
    it('should contain expected typecasts', () => {
      expect(TYPECASTS).toBeDefined();
      expect(Object.keys(TYPECASTS)).toContain('int');
      expect(Object.keys(TYPECASTS)).toContain('string');
      expect(Object.keys(TYPECASTS)).toContain('bytes');
      expect(Object.keys(TYPECASTS)).toContain('bool');
      expect(Object.keys(TYPECASTS)).toContain('date');
    });

    it('should have code and codeDesc for each typecast', () => {
      const castNames = Object.keys(TYPECASTS);
      for (const name of castNames) {
        const cast = TYPECASTS[name];
        expect(cast).toHaveProperty('code');
        expect(cast).toHaveProperty('codeDesc');
        expect(typeof cast.code).toBe('string');
        expect(typeof cast.codeDesc).toBe('string');
      }
    });
  });

  describe('LANGUAGE', () => {
    it('should be a combination of global functions and instantiations only', () => {
      expect(LANGUAGE).toBeDefined();
      // Check that LANGUAGE contains entries from global functions and instantiations
      // Note: STATEMENTS is empty and TYPECASTS is not included in LANGUAGE
      expect(Object.keys(LANGUAGE)).toEqual(
        expect.arrayContaining(Object.keys(GLOBAL_FUNCTIONS))
      );
      expect(Object.keys(LANGUAGE)).toEqual(
        expect.arrayContaining(Object.keys(INSTANTIATIONS))
      );
      // TYPECASTS is NOT included in LANGUAGE
      expect(Object.keys(LANGUAGE)).not.toEqual(
        expect.arrayContaining(Object.keys(TYPECASTS))
      );
    });

    it('should merge objects correctly without conflicts', () => {
      // Make sure there are no overlapping keys that would cause conflicts
      const globalKeys = Object.keys(GLOBAL_FUNCTIONS);
      const instantiationKeys = Object.keys(INSTANTIATIONS);

      // Check for any duplicate keys
      const allKeys = [...globalKeys, ...instantiationKeys];
      const uniqueKeys = new Set(allKeys);
      expect(allKeys.length).toBe(uniqueKeys.size);
    });
  });

  describe('DOT_COMPLETIONS', () => {
    it('should contain expected dot completions', () => {
      expect(DOT_COMPLETIONS).toBeDefined();
      expect(DOT_COMPLETIONS).toHaveProperty('tx');
      expect(DOT_COMPLETIONS).toHaveProperty('inputs');
      expect(DOT_COMPLETIONS).toHaveProperty('inputs_indexed');
      expect(DOT_COMPLETIONS).toHaveProperty('outputs');
      expect(DOT_COMPLETIONS).toHaveProperty('outputs_indexed');
      expect(DOT_COMPLETIONS).toHaveProperty('this');
      expect(DOT_COMPLETIONS).toHaveProperty('console');
    });

    it('should have CompletionItem arrays for each entry', () => {
      const keys = Object.keys(DOT_COMPLETIONS);
      for (const key of keys) {
        const completions = DOT_COMPLETIONS[key];
        expect(Array.isArray(completions)).toBeTruthy();
        
        for (const completion of completions) {
          expect(completion).toHaveProperty('label');
          expect(completion).toHaveProperty('kind');
          expect(typeof completion.label).toBe('string');
          expect(typeof completion.kind).toBe('number'); // CompletionItemKind is a number enum
        }
      }
    });

    it('should have expected labels for tx completions', () => {
      const txCompletions = DOT_COMPLETIONS.tx;
      const labels = txCompletions.map(item => item.label);
      expect(labels).toContain('version');
      expect(labels).toContain('locktime');
      expect(labels).toContain('inputs');
      expect(labels).toContain('outputs');
      expect(labels).toContain('time');
    });

    it('should have expected labels for inputs completions', () => {
      const inputsCompletions = DOT_COMPLETIONS.inputs;
      const labels = inputsCompletions.map(item => item.label);
      expect(labels).toContain('length');
    });

    it('should have expected labels for inputs_indexed completions', () => {
      const inputsIndexedCompletions = DOT_COMPLETIONS.inputs_indexed;
      const labels = inputsIndexedCompletions.map(item => item.label);
      expect(labels).toContain('value');
      expect(labels).toContain('lockingBytecode');
      expect(labels).toContain('outpointTransactionHash');
      expect(labels).toContain('outpointIndex');
      expect(labels).toContain('unlockingBytecode');
      expect(labels).toContain('sequenceNumber');
      expect(labels).toContain('tokenCategory');
      expect(labels).toContain('nftCommitment');
      expect(labels).toContain('tokenAmount');
    });

    it('should have expected labels for outputs completions', () => {
      const outputsCompletions = DOT_COMPLETIONS.outputs;
      const labels = outputsCompletions.map(item => item.label);
      expect(labels).toContain('length');
    });

    it('should have expected labels for outputs_indexed completions', () => {
      const outputsIndexedCompletions = DOT_COMPLETIONS.outputs_indexed;
      const labels = outputsIndexedCompletions.map(item => item.label);
      expect(labels).toContain('value');
      expect(labels).toContain('lockingBytecode');
      expect(labels).toContain('tokenCategory');
      expect(labels).toContain('nftCommitment');
      expect(labels).toContain('tokenAmount');
    });

    it('should have expected labels for this completions', () => {
      const thisCompletions = DOT_COMPLETIONS.this;
      const labels = thisCompletions.map(item => item.label);
      expect(labels).toContain('activeInputIndex');
      expect(labels).toContain('activeBytecode');
      expect(labels).toContain('age');
    });

    it('should have expected labels for console completions', () => {
      const consoleCompletions = DOT_COMPLETIONS.console;
      const labels = consoleCompletions.map(item => item.label);
      expect(labels).toContain('log');
    });
  });
});