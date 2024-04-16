"use client";
import React from 'react'
import Editor from '@monaco-editor/react';

export default function Playround() {
    return <Editor theme={"vs-dark"} height="100vh" defaultLanguage="javascript" defaultValue="// some comment" />;

}
