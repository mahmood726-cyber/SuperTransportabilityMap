"""Tests for the SuperTransportabilityMap harmonizer (TMLE transport engine).

Import-smoke (guards the dep/stdout-shim regression) plus contract tests for
the pure helpers get_hash() and tmle_fluctuation_step().
"""
import hashlib
import importlib.util
import os
import sys

import pytest

_SCRIPT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "data_engine", "harmonizer.py")


def _load():
    sys.path.insert(0, os.path.dirname(_SCRIPT))
    spec = importlib.util.spec_from_file_location("harmonizer", _SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_module_imports():
    assert _load() is not None


def test_get_hash_matches_sha256(tmp_path):
    f = tmp_path / "x.bin"
    data = b"transportability"
    f.write_bytes(data)
    expected = hashlib.sha256(data).hexdigest()
    assert _load().get_hash(str(f)) == expected


def test_get_hash_missing_file_sentinel():
    assert _load().get_hash(str("does_not_exist_zzz.bin")) == "FILE_NOT_FOUND"


def test_tmle_fluctuation_returns_probability():
    mod = _load()
    # epsilon>0 and clever covariate>0, so a 0.5 baseline is nudged up but
    # stays a valid probability in (0,1).
    out = mod.tmle_fluctuation_step(0.5, 1.0)
    assert 0.0 < out < 1.0
    assert out > 0.5


def test_tmle_fluctuation_handles_range_of_propensities():
    mod = _load()
    for prop in (0.05, 0.25, 0.5, 0.9):
        out = mod.tmle_fluctuation_step(0.4, prop)
        assert 0.0 < out < 1.0


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-q"]))
