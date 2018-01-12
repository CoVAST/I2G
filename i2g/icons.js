define(function(){

    let icons = {
        people: 'M392.857 392.020q0 33.482-20.368 52.874t-54.129 19.392h-243.862q-33.761 0-54.129-19.392t-20.368-52.874q0-14.788 0.977-28.878t3.906-30.413 7.394-30.273 11.998-27.204 17.299-22.601 23.856-14.927 31.11-5.581q2.511 0 11.719 5.999t20.787 13.393 30.134 13.393 37.249 5.999 37.249-5.999 30.134-13.393 20.787-13.393 11.719-5.999q17.020 0 31.11 5.581t23.856 14.927 17.299 22.601 11.998 27.204 7.394 30.273 3.906 30.413 0.977 28.878zM303.571 142.857q0 44.364-31.39 75.753t-75.753 31.39-75.753-31.39-31.39-75.753 31.39-75.753 75.753-31.39 75.753 31.39 31.39 75.753z',

        time: 'M250 151.786v125q0 3.906-2.511 6.417t-6.417 2.511h-89.286q-3.906 0-6.417-2.511t-2.511-6.417v-17.857q0-3.906 2.511-6.417t6.417-2.511h62.5v-98.214q0-3.906 2.511-6.417t6.417-2.511h17.857q3.906 0 6.417 2.511t2.511 6.417zM366.071 250q0-41.294-20.368-76.172t-55.246-55.246-76.172-20.368-76.172 20.368-55.246 55.246-20.368 76.172 20.368 76.172 55.246 55.246 76.172 20.368 76.172-20.368 55.246-55.246 20.368-76.172zM428.571 250q0 58.315-28.739 107.562t-77.985 77.985-107.562 28.739-107.562-28.739-77.985-77.985-28.739-107.562 28.739-107.562 77.985-77.985 107.562-28.739 107.562 28.739 77.985 77.985 28.739 107.562z',

        date: 'M35.714 464.286h80.357v-80.357h-80.357v80.357zM133.929 464.286h89.286v-80.357h-89.286v80.357zM35.714 366.071h80.357v-89.286h-80.357v89.286zM133.929 366.071h89.286v-89.286h-89.286v89.286zM35.714 258.929h80.357v-80.357h-80.357v80.357zM241.071 464.286h89.286v-80.357h-89.286v80.357zM133.929 258.929h89.286v-80.357h-89.286v80.357zM348.214 464.286h80.357v-80.357h-80.357v80.357zM241.071 366.071h89.286v-89.286h-89.286v89.286zM142.857 125v-80.357q0-3.627-2.651-6.278t-6.278-2.651h-17.857q-3.627 0-6.278 2.651t-2.651 6.278v80.357q0 3.627 2.651 6.278t6.278 2.651h17.857q3.627 0 6.278-2.651t2.651-6.278zM348.214 366.071h80.357v-89.286h-80.357v89.286zM241.071 258.929h89.286v-80.357h-89.286v80.357zM348.214 258.929h80.357v-80.357h-80.357v80.357zM357.143 125v-80.357q0-3.627-2.651-6.278t-6.278-2.651h-17.857q-3.627 0-6.278 2.651t-2.651 6.278v80.357q0 3.627 2.651 6.278t6.278 2.651h17.857q3.627 0 6.278-2.651t2.651-6.278zM464.286 107.143v357.143q0 14.509-10.603 25.112t-25.112 10.603h-392.857q-14.509 0-25.112-10.603t-10.603-25.112v-357.143q0-14.509 10.603-25.112t25.112-10.603h35.714v-26.786q0-18.415 13.114-31.529t31.529-13.114h17.857q18.415 0 31.529 13.114t13.114 31.529v26.786h107.143v-26.786q0-18.415 13.114-31.529t31.529-13.114h17.857q18.415 0 31.529 13.114t13.114 31.529v26.786h35.714q14.509 0 25.112 10.603t10.603 25.112z',

        location: 'M214.286 178.571q0-29.576-20.926-50.502t-50.502-20.926-50.502 20.926-20.926 50.502 20.926 50.502 50.502 20.926 50.502-20.926 20.926-50.502zM285.714 178.571q0 30.413-9.208 49.944l-101.562 215.96q-4.464 9.208-13.253 14.509t-18.833 5.301-18.833-5.301-12.974-14.509l-101.841-215.96q-9.208-19.531-9.208-49.944 0-59.152 41.853-101.004t101.004-41.853 101.004 41.853 41.853 101.004z',

        money: 'M272.879 330.636q0 42.69-27.762 73.521t-72.126 38.086v48.828q0 3.906-2.511 6.417t-6.417 2.511h-37.667q-3.627 0-6.278-2.651t-2.651-6.278v-48.828q-18.415-2.511-35.575-8.649t-28.32-12.417-20.647-13.393-12.974-10.463-4.883-5.022q-4.743-5.859-0.558-11.44l28.739-37.667q1.953-2.79 6.417-3.348 4.185-0.558 6.696 2.511l0.558 0.558q31.529 27.623 67.801 34.877 10.324 2.232 20.647 2.232 22.601 0 39.76-11.998t17.16-34.040q0-7.813-4.185-14.788t-9.347-11.719-16.323-10.463-18.415-8.929-22.321-9.068q-10.882-4.464-17.16-6.976t-17.16-7.394-17.438-8.649-15.765-9.905-14.927-11.858-12.137-13.672-9.905-16.183-5.859-18.555-2.372-21.763q0-38.504 27.344-67.522t71.149-37.388v-50.223q0-3.627 2.651-6.278t6.278-2.651h37.667q3.906 0 6.417 2.511t2.511 6.417v49.107q15.904 1.674 30.832 6.417t24.274 9.347 17.718 10.463 10.882 8.091 4.185 3.906q4.743 5.022 1.395 10.603l-22.601 40.737q-2.232 4.185-6.417 4.464-3.906 0.837-7.534-1.953-0.837-0.837-4.046-3.348t-10.882-7.394-16.323-8.929-20.787-7.254-23.856-3.208q-26.507 0-43.248 11.998t-16.741 30.971q0 7.254 2.372 13.393t8.231 11.579 11.021 9.208 15.625 8.649 16.88 7.534 19.531 7.673q14.788 5.581 22.601 8.789t21.206 9.766 21.066 11.858 17.299 13.951 14.788 17.718 8.789 21.345 3.627 26.228z',

        words: 'M22.601 35.993l15.067 7.534q5.581 1.395 58.873 1.395h36.272l5.301-0.837 32.087-0.279 59.989 0.279h81.752l9.487 0.558q3.906 0.279 7.813-1.953t5.859-4.464l1.953-2.232 11.719-0.279q4.185 0 7.813 0.279v29.157t0.279 36.691l0.279 27.902-0.279 16.183q0 8.929-1.116 14.23-10.882 4.185-18.973 5.022-6.976-11.998-15.067-35.714-2.232-6.696-4.325-17.438t-3.208-18.276-1.674-8.091q-3.627-4.185-7.534-5.301-1.953-0.558-11.858-0.558t-28.878 0.279-30.971 0.279q-9.487 0-18.694 1.395-2.79 27.065-2.232 37.946l0.279 42.411v92.634l0.837 100.167-0.279 41.016q-0.279 12.835 3.069 23.716 13.672 6.976 24.833 8.929 0.558 0 5.022 1.395t12.277 3.627 11.998 3.348q8.371 2.232 13.951 5.022 1.395 12.556 1.395 13.951 0 2.79-0.837 8.091-3.906 0.279-9.487 0.279-30.692 0-52.176-2.79-20.089-2.232-66.406-2.232-24.554 0-65.011 3.906-13.393 1.116-19.531 1.116-0.558-6.138-0.558-7.254l-0.279-7.254v-2.511q5.859-9.208 22.042-13.672 38.784-10.603 44.364-13.951 2.511-5.859 3.348-15.625 2.232-53.571 1.674-120.815l-1.395-119.419q-0.279-17.299-0.14-33.063t0.14-28.599-0.558-15.904-1.674-4.185q-1.674-1.395-3.906-1.674-10.603-1.674-41.294-1.674-11.998 0-27.902 3.767t-20.368 6.836q-3.627 2.511-6.138 9.208t-6.138 20.926-6.696 23.438q-1.674 5.301-5.441 8.929t-5.72 3.627q-12.277-7.534-15.625-12.277v-106.864zM486.607 392.857q9.208 0 11.719 5.162t-3.069 12.417l-35.156 45.201q-5.581 7.254-13.672 7.254t-13.672-7.254l-35.156-45.201q-5.581-7.254-3.069-12.417t11.719-5.162h22.321v-285.714h-22.321q-9.208 0-11.719-5.162t3.069-12.417l35.156-45.201q5.581-7.254 13.672-7.254t13.672 7.254l35.156 45.201q5.581 7.254 3.069 12.417t-11.719 5.162h-22.321v285.714h22.321z',

        info: 'M285.714 383.929v-44.643q0-3.906-2.511-6.417t-6.417-2.511h-26.786v-142.857q0-3.906-2.511-6.417t-6.417-2.511h-89.286q-3.906 0-6.417 2.511t-2.511 6.417v44.643q0 3.906 2.511 6.417t6.417 2.511h26.786v89.286h-26.786q-3.906 0-6.417 2.511t-2.511 6.417v44.643q0 3.906 2.511 6.417t6.417 2.511h125q3.906 0 6.417-2.511t2.511-6.417zM250 133.929v-44.643q0-3.906-2.511-6.417t-6.417-2.511h-53.571q-3.906 0-6.417 2.511t-2.511 6.417v44.643q0 3.906 2.511 6.417t6.417 2.511h53.571q3.906 0 6.417-2.511t2.511-6.417zM428.571 250q0 58.315-28.739 107.562t-77.985 77.985-107.562 28.739-107.562-28.739-77.985-77.985-28.739-107.562 28.739-107.562 77.985-77.985 107.562-28.739 107.562 28.739 77.985 77.985 28.739 107.562z',

        question: 'M250 383.929v-53.571q0-3.906-2.511-6.417t-6.417-2.511h-53.571q-3.906 0-6.417 2.511t-2.511 6.417v53.571q0 3.906 2.511 6.417t6.417 2.511h53.571q3.906 0 6.417-2.511t2.511-6.417zM321.429 196.429q0-24.554-15.485-45.48t-38.644-32.366-47.433-11.44q-67.801 0-103.516 59.431-4.185 6.696 2.232 11.719l36.831 27.902q1.953 1.674 5.301 1.674 4.464 0 6.976-3.348 14.788-18.973 23.996-25.669 9.487-6.696 23.996-6.696 13.393 0 23.856 7.254t10.463 16.462q0 10.603-5.581 17.020t-18.973 12.556q-17.578 7.813-32.227 24.135t-14.648 35.017v10.044q0 3.906 2.511 6.417t6.417 2.511h53.571q3.906 0 6.417-2.511t2.511-6.417q0-5.301 5.999-13.812t15.207-13.812q8.929-5.022 13.672-7.952t12.835-9.766 12.417-13.393 7.813-16.88 3.488-22.601zM428.571 250q0 58.315-28.739 107.562t-77.985 77.985-107.562 28.739-107.562-28.739-77.985-77.985-28.739-107.562 28.739-107.562 77.985-77.985 107.562-28.739 107.562 28.739 77.985 77.985 28.739 107.562z',

        signal: 'M107.143 375q0 22.321-15.625 37.946t-37.946 15.625-37.946-15.625-15.625-37.946 15.625-37.946 37.946-15.625 37.946 15.625 15.625 37.946zM250 409.319q0.558 7.813-4.743 13.393-5.022 5.859-13.114 5.859h-37.667q-6.976 0-11.998-4.604t-5.581-11.579q-6.138-63.895-51.479-109.235t-109.235-51.479q-6.976-0.558-11.579-5.581t-4.604-11.998v-37.667q0-8.091 5.859-13.114 4.743-4.743 11.998-4.743h1.395q44.643 3.627 85.379 22.461t72.266 50.642q31.808 31.529 50.642 72.266t22.461 85.379zM392.857 409.877q0.558 7.534-5.022 13.114-5.022 5.581-12.835 5.581h-39.899q-7.254 0-12.417-4.883t-5.441-11.858q-3.348-59.989-28.181-113.979t-64.593-93.75-93.75-64.593-113.979-28.46q-6.976-0.279-11.858-5.441t-4.883-12.137v-39.899q0-7.813 5.581-12.835 5.022-5.022 12.277-5.022h0.837q73.103 3.627 139.927 33.482t118.722 82.031q52.176 51.897 82.031 118.722t33.482 139.927z',

        crosspath: 'M185.826 134.208q-16.741 25.669-38.226 76.172-6.138-12.556-10.324-20.229t-11.3-17.718-14.23-15.765-17.578-9.766-22.74-4.046h-62.5q-3.906 0-6.417-2.511t-2.511-6.417v-53.571q0-3.906 2.511-6.417t6.417-2.511h62.5q69.754 0 114.397 62.779zM500 357.143q0 3.906-2.511 6.417l-89.286 89.286q-2.511 2.511-6.417 2.511-3.627 0-6.278-2.651t-2.651-6.278v-53.571q-8.929 0-23.716 0.14t-22.601 0.279-20.368-0.279-19.81-1.395-17.857-2.93-17.578-5.162-16.183-7.952-16.462-11.161-15.346-14.927-15.625-19.392q16.462-25.949 37.946-76.172 6.138 12.556 10.324 20.229t11.3 17.718 14.23 15.765 17.578 9.766 22.74 4.046h71.429v-53.571q0-3.906 2.511-6.417t6.417-2.511q3.348 0 6.696 2.79l89.007 89.007q2.511 2.511 2.511 6.417zM500 107.143q0 3.906-2.511 6.417l-89.286 89.286q-2.511 2.511-6.417 2.511-3.627 0-6.278-2.651t-2.651-6.278v-53.571h-71.429q-13.393 0-24.274 4.185t-19.252 12.556-14.23 17.16-12.556 21.624q-8.929 17.299-21.763 47.712-8.091 18.415-13.812 30.971t-15.067 29.297-17.857 27.902-20.647 23.159-25.112 19.113-29.715 11.719-35.714 4.604h-62.5q-3.906 0-6.417-2.511t-2.511-6.417v-53.571q0-3.906 2.511-6.417t6.417-2.511h62.5q13.393 0 24.274-4.185t19.252-12.556 14.23-17.16 12.556-21.624q8.929-17.299 21.763-47.712 8.091-18.415 13.812-30.971t15.067-29.297 17.857-27.902 20.647-23.159 25.112-19.113 29.715-11.719 35.714-4.604h71.429v-53.571q0-3.906 2.511-6.417t6.417-2.511q3.348 0 6.696 2.79l89.007 89.007q2.511 2.511 2.511 6.417z',

        search: 'M321.429 232.143q0-51.618-36.691-88.309t-88.309-36.691-88.309 36.691-36.691 88.309 36.691 88.309 88.309 36.691 88.309-36.691 36.691-88.309zM464.286 464.286q0 14.509-10.603 25.112t-25.112 10.603q-15.067 0-25.112-10.603l-95.703-95.424q-49.944 34.598-111.328 34.598-39.899 0-76.312-15.485t-62.779-41.853-41.853-62.779-15.485-76.312 15.485-76.312 41.853-62.779 62.779-41.853 76.312-15.485 76.312 15.485 62.779 41.853 41.853 62.779 15.485 76.312q0 61.384-34.598 111.328l95.703 95.703q10.324 10.324 10.324 25.112z',

        like: 'M71.429 375q0-7.254-5.301-12.556t-12.556-5.301q-7.534 0-12.695 5.301t-5.162 12.556q0 7.534 5.162 12.695t12.695 5.162q7.254 0 12.556-5.162t5.301-12.695zM116.071 232.143v178.571q0 7.254-5.301 12.556t-12.556 5.301h-80.357q-7.254 0-12.556-5.301t-5.301-12.556v-178.571q0-7.254 5.301-12.556t12.556-5.301h80.357q7.254 0 12.556 5.301t5.301 12.556zM446.429 232.143q0 23.996-15.346 41.574 4.185 12.277 4.185 21.206 0.837 21.206-11.998 38.226 4.743 15.625 0 32.645-4.185 15.904-15.067 26.228 2.511 31.25-13.672 50.502-17.857 21.206-54.966 21.763h-35.993q-18.415 0-40.179-4.325t-33.901-8.091-33.622-11.021q-34.319-11.998-44.085-12.277-7.254-0.279-12.556-5.441t-5.301-12.417v-178.851q0-6.976 5.022-12.137t11.998-5.72q6.696-0.558 21.206-16.462t28.181-33.761q18.973-24.274 28.181-33.482 5.022-5.022 8.649-13.393t4.883-13.532 3.767-16.88q1.953-10.882 3.488-17.020t5.441-14.509 9.487-13.951q5.301-5.301 12.556-5.301 12.835 0 23.019 2.93t16.741 7.254 11.161 11.3 6.696 12.556 3.348 13.951 1.395 12.556 0.14 10.882q0 10.603-2.651 21.206t-5.301 16.741-7.673 15.625q-0.837 1.674-2.79 5.022t-3.069 6.138-2.232 6.696h77.288q21.763 0 37.667 15.904t15.904 37.667z',

        idea: 'M205.357 160.714q0 3.627-2.651 6.278t-6.278 2.651-6.278-2.651-2.651-6.278q0-12.835-15.067-19.81t-29.576-6.976q-3.627 0-6.278-2.651t-2.651-6.278 2.651-6.278 6.278-2.651q13.951 0 27.762 4.464t24.274 15.067 10.463 25.112zM250 160.714q0-20.089-9.626-37.388t-25.112-28.32-34.319-17.299-38.086-6.278-38.086 6.278-34.319 17.299-25.112 28.32-9.626 37.388q0 28.181 18.973 50.223 2.79 3.069 8.51 9.208t8.51 9.208q35.714 42.69 39.341 83.147h63.616q3.627-40.458 39.341-83.147 2.79-3.069 8.51-9.208t8.51-9.208q18.973-22.042 18.973-50.223zM285.714 160.714q0 43.248-28.739 74.777-12.556 13.672-20.787 24.274t-16.602 26.646-9.487 29.995q13.114 7.813 13.114 22.879 0 10.324-6.976 17.857 6.976 7.534 6.976 17.857 0 14.509-12.556 22.601 3.627 6.417 3.627 13.114 0 12.835-8.789 19.81t-21.624 6.976q-5.581 12.277-16.741 19.531t-24.274 7.254-24.274-7.254-16.741-19.531q-12.835 0-21.624-6.976t-8.789-19.81q0-6.696 3.627-13.114-12.556-8.091-12.556-22.601 0-10.324 6.976-17.857-6.976-7.534-6.976-17.857 0-15.067 13.114-22.879-1.116-13.951-9.487-29.995t-16.602-26.646-20.787-24.274q-28.739-31.529-28.739-74.777 0-27.623 12.417-51.479t32.645-39.621 45.759-24.833 52.037-9.068 52.037 9.068 45.759 24.833 32.645 39.621 12.417 51.479z',

        warning: 'M214.286 35.714q58.315 0 107.562 28.739t77.985 77.985 28.739 107.562-28.739 107.562-77.985 77.985-107.562 28.739-107.562-28.739-77.985-77.985-28.739-107.562 28.739-107.562 77.985-77.985 107.562-28.739zM250 383.649v-53.013q0-3.906-2.511-6.557t-6.138-2.651h-53.571q-3.627 0-6.417 2.79t-2.79 6.417v53.013q0 3.627 2.79 6.417t6.417 2.79h53.571q3.627 0 6.138-2.651t2.511-6.557zM249.442 287.667l5.022-173.27q0-3.348-2.79-5.022-2.79-2.232-6.696-2.232h-61.384q-3.906 0-6.696 2.232-2.79 1.674-2.79 5.022l4.743 173.27q0 2.79 2.79 4.883t6.696 2.093h51.618q3.906 0 6.557-2.093t2.93-4.883z',

        comment: 'M500 250q0 48.549-33.482 89.704t-90.96 65.011-125.558 23.856q-19.531 0-40.458-2.232-55.246 48.828-128.348 67.522-13.672 3.906-31.808 6.138-4.743 0.558-8.51-2.511t-4.883-8.091v-0.279q-0.837-1.116-0.14-3.348t0.558-2.79 1.255-2.651l1.674-2.511t1.953-2.372 2.232-2.511q1.953-2.232 8.649-9.626t9.626-10.603 8.649-11.021 9.068-14.23 7.534-16.462 7.254-21.206q-43.806-24.833-69.057-61.384t-25.251-78.404q0-36.272 19.81-69.336t53.292-57.059 79.799-38.086 97.098-14.090q68.081 0 125.558 23.856t90.96 65.011 33.482 89.704z',
        message: 'M500 250q0 48.549-33.482 89.704t-90.96 65.011-125.558 23.856q-19.531 0-40.458-2.232-55.246 48.828-128.348 67.522-13.672 3.906-31.808 6.138-4.743 0.558-8.51-2.511t-4.883-8.091v-0.279q-0.837-1.116-0.14-3.348t0.558-2.79 1.255-2.651l1.674-2.511t1.953-2.372 2.232-2.511q1.953-2.232 8.649-9.626t9.626-10.603 8.649-11.021 9.068-14.23 7.534-16.462 7.254-21.206q-43.806-24.833-69.057-61.384t-25.251-78.404q0-36.272 19.81-69.336t53.292-57.059 79.799-38.086 97.098-14.090q68.081 0 125.558 23.856t90.96 65.011 33.482 89.704z',

        check: 'M358.259 204.799q0-7.813-5.022-12.835l-25.391-25.112q-5.301-5.301-12.556-5.301t-12.556 5.301l-113.839 113.56-63.058-63.058q-5.301-5.301-12.556-5.301t-12.556 5.301l-25.391 25.112q-5.022 5.022-5.022 12.835 0 7.534 5.022 12.556l101.004 101.004q5.301 5.301 12.556 5.301 7.534 0 12.835-5.301l151.507-151.507q5.022-5.022 5.022-12.556zM428.571 250q0 58.315-28.739 107.562t-77.985 77.985-107.562 28.739-107.562-28.739-77.985-77.985-28.739-107.562 28.739-107.562 77.985-77.985 107.562-28.739 107.562 28.739 77.985 77.985 28.739 107.562z',

        key: 'M232.143 142.857q0-22.321-15.625-37.946t-37.946-15.625-37.946 15.625-15.625 37.946q0 11.719 5.301 23.159-11.44-5.301-23.159-5.301-22.321 0-37.946 15.625t-15.625 37.946 15.625 37.946 37.946 15.625 37.946-15.625 15.625-37.946q0-11.719-5.301-23.159 11.44 5.301 23.159 5.301 22.321 0 37.946-15.625t15.625-37.946zM469.587 339.286q0 4.743-13.672 18.415t-18.415 13.672q-2.511 0-7.952-4.464t-10.184-9.208-10.742-11.161-6.836-7.254l-26.786 26.786 61.384 61.384q7.813 7.813 7.813 18.973 0 11.719-10.882 22.601t-22.601 10.882q-11.161 0-18.973-7.813l-187.221-187.221q-49.107 36.551-101.841 36.551-45.48 0-74.079-28.599t-28.599-74.079q0-44.643 26.507-87.333t69.196-69.196 87.333-26.507q45.48 0 74.079 28.599t28.599 74.079q0 52.734-36.551 101.841l99.051 99.051 26.786-26.786q-0.837-0.837-7.254-6.836t-11.161-10.742-9.208-10.184-4.464-7.952q0-4.743 13.672-18.415t18.415-13.672q3.627 0 6.417 2.79 1.674 1.674 12.835 12.417t22.879 22.182 24.135 23.996 20.368 21.763 7.952 11.44z',

        phone: 'M392.857 345.982q0 7.534-2.79 19.671t-5.859 19.113q-5.859 13.951-34.040 29.576-26.228 14.23-51.897 14.23-7.534 0-14.648-0.977t-16.043-3.488-13.253-4.046-15.485-5.72-13.672-5.022q-27.344-9.766-48.828-23.159-35.714-22.042-73.8-60.128t-60.128-73.8q-13.393-21.484-23.159-48.828-0.837-2.511-5.022-13.672t-5.72-15.485-4.046-13.253-3.488-16.043-0.977-14.648q0-25.669 14.23-51.897 15.625-28.181 29.576-34.040 6.976-3.069 19.113-5.859t19.671-2.79q3.906 0 5.859 0.837 5.022 1.674 14.788 21.206 3.069 5.301 8.371 15.067t9.766 17.718 8.649 14.927q0.837 1.116 4.883 6.976t5.999 9.905 1.953 7.952q0 5.581-7.952 13.951t-17.299 15.346-17.299 14.788-7.952 12.835q0 2.511 1.395 6.278t2.372 5.72 3.906 6.696 3.208 5.301q21.206 38.226 48.549 65.569t65.569 48.549q0.558 0.279 5.301 3.208t6.696 3.906 5.72 2.372 6.278 1.395q5.022 0 12.835-7.952t14.788-17.299 15.346-17.299 13.951-7.952q3.906 0 7.952 1.953t9.905 5.999 6.976 4.883q6.976 4.185 14.927 8.649t17.718 9.766 15.067 8.371q19.531 9.766 21.206 14.788 0.837 1.953 0.837 5.859z',

        movement: 'M390.904 97.377l-178.571 357.143q-4.743 9.766-15.904 9.766-1.395 0-4.185-0.558-6.138-1.395-9.905-6.278t-3.767-11.021v-160.714h-160.714q-6.138 0-11.021-3.767t-6.278-9.905 1.116-11.719 8.091-8.371l357.143-178.571q3.627-1.953 8.091-1.953 7.534 0 12.556 5.301 4.185 3.906 5.162 9.626t-1.813 11.021z',

        unknown: 'M214.286 178.571q0-29.576-20.926-50.502t-50.502-20.926-50.502 20.926-20.926 50.502 20.926 50.502 50.502 20.926 50.502-20.926 20.926-50.502zM285.714 178.571q0 30.413-9.208 49.944l-101.562 215.96q-4.464 9.208-13.253 14.509t-18.833 5.301-18.833-5.301-12.974-14.509l-101.841-215.96q-9.208-19.531-9.208-49.944 0-59.152 41.853-101.004t101.004-41.853 101.004 41.853 41.853 101.004z'
    };

    return function(type) {
        return logos.hasOwnProperty(type) ? icons[type] : icons['unknown'];
    }
})