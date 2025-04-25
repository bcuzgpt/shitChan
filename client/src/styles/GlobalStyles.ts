import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Verdana', 'Tahoma', sans-serif;
    background-color: #d6daf0;
    color: #800000;
    line-height: 1.4;
    font-size: 14px;
  }

  a {
    color: #0000ee;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #800000;
    margin-bottom: 10px;
  }

  button {
    background-color: #d6daf0;
    border: 1px solid #800000;
    color: #800000;
    padding: 5px 10px;
    cursor: pointer;
    font-family: 'Verdana', 'Tahoma', sans-serif;
  }

  button:hover {
    background-color: #b7c5d9;
  }

  input, textarea {
    font-family: 'Verdana', 'Tahoma', sans-serif;
    border: 1px solid #800000;
    background-color: #d6daf0;
    color: #800000;
    padding: 5px;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #0000ee;
  }

  .post {
    background-color: #d6daf0;
    border: 1px solid #b7c5d9;
    margin-bottom: 10px;
    padding: 10px;
  }

  .post-header {
    border-bottom: 1px solid #b7c5d9;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }

  .post-content {
    margin-bottom: 10px;
  }

  .post-image {
    max-width: 300px;
    max-height: 300px;
    margin-bottom: 10px;
  }

  .post-footer {
    border-top: 1px solid #b7d9d9;
    margin-top: 10px;
    padding-top: 5px;
    font-size: 12px;
  }

  .thread {
    background-color: #d6daf0;
    border: 1px solid #b7c5d9;
    margin-bottom: 20px;
    padding: 10px;
  }

  .thread-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .thread-content {
    margin-bottom: 10px;
  }

  .thread-image {
    max-width: 300px;
    max-height: 300px;
    margin-bottom: 10px;
  }

  .thread-replies {
    margin-top: 10px;
  }

  .reply {
    background-color: #d6daf0;
    border: 1px solid #b7c5d9;
    margin-bottom: 10px;
    padding: 10px;
  }

  .reply-header {
    border-bottom: 1px solid #b7c5d9;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }

  .reply-content {
    margin-bottom: 10px;
  }

  .reply-image {
    max-width: 200px;
    max-height: 200px;
    margin-bottom: 10px;
  }

  .reply-footer {
    border-top: 1px solid #b7d9d9;
    margin-top: 10px;
    padding-top: 5px;
    font-size: 12px;
  }

  .board-header {
    background-color: #d6daf0;
    border-bottom: 1px solid #b7c5d9;
    margin-bottom: 20px;
    padding: 10px;
  }

  .board-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .board-description {
    margin-bottom: 10px;
  }

  .form-container {
    background-color: #d6daf0;
    border: 1px solid #b7c5d9;
    margin-bottom: 20px;
    padding: 10px;
  }

  .form-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-label {
    display: block;
    margin-bottom: 5px;
  }

  .form-input {
    width: 100%;
    padding: 5px;
  }

  .form-textarea {
    width: 100%;
    min-height: 100px;
    padding: 5px;
  }

  .form-button {
    background-color: #d6daf0;
    border: 1px solid #800000;
    color: #800000;
    padding: 5px 10px;
    cursor: pointer;
  }

  .form-button:hover {
    background-color: #b7c5d9;
  }

  .form-error {
    color: #ff0000;
    margin-top: 5px;
  }

  .form-success {
    color: #008000;
    margin-top: 5px;
  }

  .form-info {
    color: #0000ee;
    margin-top: 5px;
  }

  .form-warning {
    color: #ffa500;
    margin-top: 5px;
  }

  .form-file {
    margin-top: 10px;
  }

  .form-preview {
    max-width: 200px;
    max-height: 200px;
    margin-top: 10px;
  }

  .form-options {
    margin-top: 10px;
    padding: 10px;
    background-color: #b7c5d9;
  }

  .form-option {
    margin-bottom: 5px;
  }

  .form-option-label {
    margin-left: 5px;
  }

  .form-option-input {
    margin-right: 5px;
  }

  .form-option-info {
    font-size: 12px;
    color: #800000;
    margin-top: 5px;
  }

  .form-option-error {
    font-size: 12px;
    color: #ff0000;
    margin-top: 5px;
  }

  .form-option-success {
    font-size: 12px;
    color: #008000;
    margin-top: 5px;
  }

  .form-option-warning {
    font-size: 12px;
    color: #ffa500;
    margin-top: 5px;
  }

  .form-option-info {
    font-size: 12px;
    color: #0000ee;
    margin-top: 5px;
  }

  .form-option-group {
    margin-bottom: 10px;
  }

  .form-option-group-title {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .form-option-group-content {
    margin-left: 20px;
  }

  .form-option-group-footer {
    margin-top: 5px;
    font-size: 12px;
    color: #800000;
  }

  .form-option-group-error {
    margin-top: 5px;
    font-size: 12px;
    color: #ff0000;
  }

  .form-option-group-success {
    margin-top: 5px;
    font-size: 12px;
    color: #008000;
  }

  .form-option-group-warning {
    margin-top: 5px;
    font-size: 12px;
    color: #ffa500;
  }

  .form-option-group-info {
    margin-top: 5px;
    font-size: 12px;
    color: #0000ee;
  }

  .form-option-group-content {
    margin-left: 20px;
  }

  .form-option-group-footer {
    margin-top: 5px;
    font-size: 12px;
    color: #800000;
  }

  .form-option-group-error {
    margin-top: 5px;
    font-size: 12px;
    color: #ff0000;
  }

  .form-option-group-success {
    margin-top: 5px;
    font-size: 12px;
    color: #008000;
  }

  .form-option-group-warning {
    margin-top: 5px;
    font-size: 12px;
    color: #ffa500;
  }

  .form-option-group-info {
    margin-top: 5px;
    font-size: 12px;
    color: #0000ee;
  }
`;

export default GlobalStyles; 