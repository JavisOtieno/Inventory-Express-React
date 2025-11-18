// src/atoms.js
import { atom } from 'jotai'

export const userAtom = atom(null)           // null = not logged in
export const loadingAtom = atom(false)
export const toastAtom = atom(null)          // {type: 'success'|'error', message: ''}